type ActionCheck = (event: KeyboardEvent) => boolean;

interface KeyboardActionMatcher<Actions> {
  type: Actions;
  check: (event: KeyboardEvent) => boolean;
}

export class KeyboardActionExctractor<T> {
  private _actionMatchers: Array<KeyboardActionMatcher<any>>;

  constructor(actionMatchers: Array<KeyboardActionMatcher<T>> = []) {
    this._actionMatchers = actionMatchers;
  }

  public add<T>(type: T, check: ActionCheck): KeyboardActionExctractor<T> {
    return new KeyboardActionExctractor(
      this._actionMatchers.concat({ type, check })
    );
  }

  public build<P = T>(defaultAction: P): (event: KeyboardEvent) => T {
    return (event) => {
      const action = this._actionMatchers.find((x) => x.check(event));
      return (action && action.type) || defaultAction;
    };
  }
}
