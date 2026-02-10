declare module 'bpmn-js/lib/Modeler' {
  import Modeler from 'bpmn-js/lib/Modeler';
  export default Modeler;
}

declare module 'canvg' {
  export class Canvg {
    static fromString(ctx: CanvasRenderingContext2D, svg: string): Promise<Canvg>;
    render(): Promise<void>;
  }
}

declare module 'diagram-js/lib/features/resize' {
  const resizeModule: any;
  export default resizeModule;
}
