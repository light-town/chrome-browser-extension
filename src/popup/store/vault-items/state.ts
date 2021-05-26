export class State {
  all: Record<string, any>;
  suggestions: Record<string, any>;
  currentVaultItemUuid: string | null;
  searchQuery: string;
}

export default (): State => ({
  all: {},
  suggestions: {},
  currentVaultItemUuid: null,
  searchQuery: "",
});
