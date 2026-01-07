import {
  NodeHandler,
  TipTapNode,
  TipTapRender,
  NodeHandlers,
} from '@troop.com/tiptap-react-render';
import { Text } from 'react-native';
interface RCTRendererProps {
  docToRender: TipTapNode;
}
export const RCTRenderer = ({ docToRender }: RCTRendererProps) => {
  // const doc: NodeHandler = new NodeHandler();
  const doc: NodeHandler = (props) => <>{props.children}</>;

  // handle a paragraph
  const paragraph: NodeHandler = (props) => {
    return (
      <Text style={{ fontSize: 16 }} className="font-sora-regular dark:text-foreground">
        {props.children}
      </Text>
    );
  };

  // handle text
  const text: NodeHandler = (props) => {
    // you could process text marks here from props.node.marks ...
    return <Text>{props.node.text}</Text>;
  };

  // create a handlers wrapper
  const handlers: NodeHandlers = {
    doc: doc,
    text: text,
    paragraph: paragraph,
  };
  return <TipTapRender node={docToRender} handlers={handlers} />;
};
