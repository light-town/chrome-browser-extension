export interface State {
  all: Record<string, any>;
}

export default (): State => ({
  all: {},
});
