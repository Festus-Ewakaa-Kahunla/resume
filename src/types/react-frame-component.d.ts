declare module "react-frame-component" {
  import { ComponentType, ReactNode } from "react";

  interface FrameProps {
    style?: React.CSSProperties;
    initialContent?: string;
    key?: string;
    children?: ReactNode;
  }

  const Frame: ComponentType<FrameProps>;
  export default Frame;
}
