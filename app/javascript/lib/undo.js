const undoRedoPlugin = (store) => {
  // initialize and save the starting stage
  undoRedoHistory.init(store);
  let firstState = cloneDeep(store.state);
  undoRedoHistory.addState(firstState);

  store.subscribe((mutation, state) => {
    // is called AFTER every mutation
    undoRedoHistory.addState(cloneDeep(state));
  });
}
