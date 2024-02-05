declare module 'vue3-smooth-dnd' {
  import { Component } from 'vue';

  type Payload = any;

  interface DropResult {
    removedIndex: number;
    addedIndex: number;
    payload: Payload;
    element: Element;
  }

  interface DragEvent {
    isSource: boolean;
    payload: Payload;
    willAcceptDrop: boolean;
  }

  interface NodeDescription {
    value: string;
    props: any;
  }

  interface ContainerProps {
    orientation?: string;
    behaviour?: string;
    tag?: string | NodeDescription;
    groupName?: string;
    lockAxis?: string;
    dragHandleSelector?: string;
    nonDragAreaSelector?: string;
    dragBeginDelay?: number;
    animationDuration?: number;
    autoScrollEnabled?: boolean;
    dragClass?: string;
    dropClass?: string;
    removeOnDropOut?: boolean;
    getChildPayload?: (index: number) => Payload;
    shouldAnimateDrop?: (sourceContainerOptions: ContainerProps, payload: Payload) => boolean;
    shouldAcceptDrop?: (sourceContainerOptions: ContainerProps, payload: Payload) => boolean;
    getGhostParent: () => Element;
    onDragStart?: (dragEvent: DragEvent) => void;
    onDragEnd?: (dragEvent: DragEvent) => void;
    onDrop?: (dropResult: DropResult) => void;
    onDragEnter?: () => void;
    onDragLeave?: () => void;
    onDropReady?: (dropResult: DropResult) => void;
  }

  interface DraggableProps {
    tag?: string | NodeDescription;
  }

  type Container = Component<ContainerProps>
  type Draggable = Component<DraggableProps>
}
