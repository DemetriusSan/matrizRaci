import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Modeler from 'bpmn-js/lib/Modeler';
import { Canvg } from 'canvg';
import resizeModule from 'diagram-js/lib/features/resize';
import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import { append as svgAppend, create as svgCreate, attr as svgAttr } from 'tiny-svg';

class TextBoxPaletteProvider {
  static $inject = ['palette', 'create', 'elementFactory', 'translate'];

  constructor(
    private palette: any,
    private create: any,
    private elementFactory: any,
    private translate: any
  ) {
    this.palette.registerProvider(this);
  }

  getPaletteEntries() {
    return {
      'create.text-annotation-custom': {
        group: 'tools',
        className: 'custom-textbox',
        title: this.translate('Caixa de texto'),
        action: {
          dragstart: (event: any) => this.createText(event),
          click: (event: any) => this.createText(event),
        },
      },
    };
  }

  private createText(event: any): void {
    const shape = this.elementFactory.createShape({
      type: 'bpmn:TextAnnotation',
      width: 180,
      height: 80,
    });
    this.create.start(event, shape);
  }
}

class TextBoxRenderer extends BaseRenderer {
  static $inject = ['eventBus'];

  constructor(eventBus: any) {
    super(eventBus, 2000);
  }

  override canRender(element: any): boolean {
    return element?.type === 'bpmn:TextAnnotation';
  }

  override drawShape(parentNode: any, element: any): any {
    const width = element.width || 180;
    const height = element.height || 80;
    const rect = svgCreate('rect');
    svgAttr(rect, {
      x: 0,
      y: 0,
      width,
      height,
      rx: 6,
      ry: 6,
      fill: 'transparent',
      stroke: 'transparent',
      strokeWidth: 0,
    });
    svgAppend(parentNode, rect);
    return rect;
  }

  override getShapePath(shape: any): string {
    const width = shape.width || 180;
    const height = shape.height || 80;
    return `M0 0 L${width} 0 L${width} ${height} L0 ${height} Z`;
  }
}

class AllowResizeRules extends RuleProvider {
  static override $inject = ['eventBus'];

  constructor(eventBus: any) {
    super(eventBus);
  }

  override init(): void {
    this.addRule('shape.resize', 1500, () => true);
  }
}

const allowResizeModule = {
  __init__: ['allowResizeRules'],
  allowResizeRules: ['type', AllowResizeRules],
};

const customPaletteModule = {
  __init__: ['textBoxPaletteProvider'],
  textBoxPaletteProvider: ['type', TextBoxPaletteProvider],
};

const customTextBoxRenderModule = {
  __init__: ['textBoxRenderer'],
  textBoxRenderer: ['type', TextBoxRenderer],
};

@Component({
  selector: 'app-bpmn',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './bpmn.html',
  styleUrl: './bpmn.scss',
})
export class BpmnEditor implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLDivElement>;

  private modeler?: Modeler;
  private isBrowser = false;
  private selectedElement: any | null = null;
  private editableElement: any | null = null;
  private placementOffset = 0;
  private connectSource: any | null = null;
  errorMessage = '';
  statusMessage = '';
  selectedName = '';
  selectedType = '';
  canEditLabel = false;
  connectMode = false;
  connectHint = '';
  iconScale = 1;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private changeDetector: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.isBrowser) {
      return;
    }

    setTimeout(() => this.initializeModeler(), 0);
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.modeler?.destroy();
    }
  }

  private initializeModeler(retry = 0): void {
    if (!this.isBrowser) {
      return;
    }

    this.errorMessage = '';
    const container = this.canvasRef?.nativeElement;
    if (!container || container.offsetWidth === 0 || container.offsetHeight === 0) {
      if (retry < 5) {
        setTimeout(() => this.initializeModeler(retry + 1), 100);
      }
      return;
    }

    if (this.modeler) {
      return;
    }

    try {
      this.modeler = new Modeler({
        container,
        additionalModules: [
          resizeModule,
          allowResizeModule,
          customPaletteModule,
          customTextBoxRenderModule,
        ],
        keyboard: {
          bindTo: window,
        },
      });

      this.errorMessage = '';

      void this.createNewDiagram().then(() => {
        this.registerSelectionEvents();
        this.registerGatewayMarkerRules();
        this.registerConnectEvents();
        this.openPalette();
        this.statusMessage = 'Editor BPMN carregado.';
      });
    } catch (error) {
      if (retry < 5) {
        setTimeout(() => this.initializeModeler(retry + 1), 150);
        return;
      }
      const errorDetails = error instanceof Error ? error.message : String(error ?? '');
      this.statusMessage = errorDetails ? `Detalhes: ${errorDetails}` : '';
      this.setErrorMessage('Não foi possível inicializar o editor BPMN.');
    }
  }

  async createNewDiagram(): Promise<void> {
    if (!this.isBrowser) {
      return;
    }
    this.errorMessage = '';
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Início" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="170" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

    await this.importXml(xml);
  }

  async importXml(xml: string): Promise<void> {
    if (!this.isBrowser) {
      return;
    }
    try {
      await this.modeler?.importXML(xml);
      this.errorMessage = '';
      this.registerSelectionEvents();
      this.registerGatewayMarkerRules();
      this.registerConnectEvents();
      this.openPalette();
    } catch (error) {
      this.setErrorMessage('Não foi possível importar o arquivo BPMN.');
    }
  }

  async saveXml(): Promise<void> {
    if (!this.modeler || !this.isBrowser) {
      return;
    }

    const result = await this.modeler.saveXML({ format: true });
    if (!result.xml) {
      this.errorMessage = 'Não foi possível gerar o arquivo BPMN.';
      return;
    }

    this.downloadFile('diagrama.bpmn', result.xml, 'application/xml');
  }

  async exportJpg(): Promise<void> {
    if (!this.modeler || !this.isBrowser) {
      return;
    }

    const result = await this.modeler.saveSVG();
    if (!result.svg) {
      this.errorMessage = 'Não foi possível exportar o diagrama.';
      return;
    }

    const svg = result.svg;
    const canvas = document.createElement('canvas');
    const { width, height } = this.getSvgSize(svg);
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const v = await Canvg.fromString(ctx, svg);
    await v.render();

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    this.downloadFile('diagrama-bpmn.jpg', dataUrl, 'image/jpeg', true);
  }

  onNameChange(name: string): void {
    if (!this.modeler || !this.editableElement || !this.canEditLabel || !this.isBrowser) {
      return;
    }

    const modeling: any = this.modeler.get('modeling');
    modeling.updateLabel(this.editableElement, name);
  }

  onFileSelected(event: Event): void {
    if (!this.isBrowser) {
      return;
    }
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      const content = reader.result as string;
      await this.importXml(content);
    };
    reader.readAsText(file);
    input.value = '';
  }

  addShape(type: string): void {
    if (!this.modeler || !this.isBrowser) {
      return;
    }

    const elementFactory: any = this.modeler.get('elementFactory');
    const modeling: any = this.modeler.get('modeling');
    const canvas: any = this.modeler.get('canvas');
    const root = canvas.getRootElement();
    const viewbox = canvas.viewbox();

    const center = {
      x: viewbox.x + viewbox.width / 2,
      y: viewbox.y + viewbox.height / 2,
    };

    const offset = this.placementOffset;
    this.placementOffset = (this.placementOffset + 40) % 200;

    const shape = elementFactory.createShape({ type });
    modeling.createShape(shape, { x: center.x + offset, y: center.y + offset }, root);
  }

  toggleConnectMode(): void {
    this.connectMode = !this.connectMode;
    this.connectSource = null;
    this.connectHint = this.connectMode
      ? 'Clique no elemento de origem'
      : '';
  }

  private downloadFile(
    filename: string,
    content: string,
    mimeType: string,
    isDataUrl = false
  ): void {
    if (!this.isBrowser) {
      return;
    }
    const link = document.createElement('a');
    if (isDataUrl) {
      link.href = content;
    } else {
      const blob = new Blob([content], { type: mimeType });
      link.href = URL.createObjectURL(blob);
    }
    link.download = filename;
    link.click();

    if (!isDataUrl) {
      URL.revokeObjectURL(link.href);
    }
  }

  private getSvgSize(svg: string): { width: number; height: number } {
    if (!this.isBrowser) {
      return { width: 1600, height: 900 };
    }
    const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
    const svgElement = doc.documentElement;
    const viewBox = svgElement.getAttribute('viewBox');

    if (viewBox) {
      const [, , width, height] = viewBox.split(' ').map(Number);
      if (width && height) {
        return { width: Math.ceil(width), height: Math.ceil(height) };
      }
    }

    const widthAttr = svgElement.getAttribute('width');
    const heightAttr = svgElement.getAttribute('height');

    const width = widthAttr ? parseInt(widthAttr, 10) : 1600;
    const height = heightAttr ? parseInt(heightAttr, 10) : 900;
    return { width, height };
  }

  private registerSelectionEvents(): void {
    if (!this.modeler || !this.isBrowser) {
      return;
    }

    const eventBus: any = this.modeler.get('eventBus');
    eventBus.off('selection.changed', this.handleSelectionChanged);
    eventBus.off('element.changed', this.handleElementChanged);
    eventBus.on('selection.changed', this.handleSelectionChanged);
    eventBus.on('element.changed', this.handleElementChanged);
  }

  private registerConnectEvents(): void {
    if (!this.modeler || !this.isBrowser) {
      return;
    }

    const eventBus: any = this.modeler.get('eventBus');
    eventBus.off('element.click', this.handleElementClick);
    eventBus.on('element.click', this.handleElementClick);
  }

  private handleElementClick = (event: any): void => {
    if (!this.connectMode || !this.modeler) {
      return;
    }

    const element = event?.element;
    if (!element || element.type === 'bpmn:Process' || element.waypoints) {
      return;
    }

    if (!this.connectSource) {
      this.connectSource = element;
      this.connectHint = 'Clique no elemento de destino';
      return;
    }

    const modeling: any = this.modeler.get('modeling');
    modeling.connect(this.connectSource, element);
    this.connectSource = null;
    this.connectMode = false;
    this.connectHint = '';
  };

  private handleSelectionChanged = (event: any): void => {
    const element = event?.newSelection?.[0] ?? null;
    this.updateSelectedElement(element);
  };

  private handleElementChanged = (event: any): void => {
    if (event?.element && this.selectedElement && event.element.id === this.selectedElement.id) {
      this.updateSelectedElement(event.element);
    }
  };

  private updateSelectedElement(element: any | null): void {
    this.selectedElement = element;
    this.editableElement = element?.labelTarget ?? element;

    if (!this.editableElement || !this.editableElement.businessObject) {
      this.selectedName = '';
      this.selectedType = '';
      this.canEditLabel = false;
      return;
    }

    this.selectedType = this.editableElement.type ?? '';
    this.selectedName = this.editableElement.businessObject.name ?? '';
    this.canEditLabel = true;
  }

  private registerGatewayMarkerRules(): void {
    if (!this.modeler || !this.isBrowser) {
      return;
    }

    const eventBus: any = this.modeler.get('eventBus');
    eventBus.off('shape.added', this.handleShapeAdded);
    eventBus.on('shape.added', this.handleShapeAdded);

    const registry: any = this.modeler.get('elementRegistry');
    registry.getAll().forEach((element: any) => this.hideGatewayMarker(element));
  }

  private handleShapeAdded = (event: any): void => {
    this.hideGatewayMarker(event?.element);
  };

  private hideGatewayMarker(element: any): void {
    if (!this.modeler || !element?.businessObject) {
      return;
    }

    if (element.businessObject.$type !== 'bpmn:ExclusiveGateway') {
      return;
    }

    const di = element.di;
    if (!di || di.get('isMarkerVisible') === false) {
      return;
    }

    di.set('isMarkerVisible', false);
    const eventBus: any = this.modeler.get('eventBus');
    eventBus.fire('element.changed', { element });
  }

  private openPalette(): void {
    if (!this.modeler || !this.isBrowser) {
      return;
    }

    const palette: any = this.modeler.get('palette');
    if (!palette) {
      return;
    }

    if (!palette.isOpen()) {
      palette.open();
    }

    const container = palette._container as HTMLElement | undefined;
    if (container && !container.classList.contains('open')) {
      container.classList.add('open');
    }

    const parent = container?.parentElement;
    if (parent && !parent.classList.contains('djs-palette-open')) {
      parent.classList.add('djs-palette-open');
    }
  }

  private setErrorMessage(message: string): void {
    if (!this.isBrowser) {
      return;
    }

    setTimeout(() => {
      this.errorMessage = message;
      this.changeDetector.markForCheck();
    }, 0);
  }
}
