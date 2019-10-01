import { ipcMain, IpcMainEvent, BrowserWindow } from 'electron';

interface CreateStoreOpts {
  name: string;
  initial: () => any;
  actions: () => {
    [name: string]: (state: any, payload: any) => any | void | undefined | null;
  };
  computed: () => {
    [name: string]: (state: any) => any
  };
  renderers: () => BrowserWindow[];
}

interface RendererPayload {
  type: string;
  rendererName: string;
  actionName?: string;
  actionPayload?: any;
}

class CargoMainStore {
  private opts: CreateStoreOpts;
  private state: any;
  private subscribed: ((state?: object) => void)[];

  constructor(opts: CreateStoreOpts) {
    this.opts = opts;
    this.onRendererEvent = this.onRendererEvent.bind(this);
    this.rendererNotifier = this.rendererNotifier.bind(this);

    this.setup();

    ipcMain.on(`store-${ this.opts.name }-renderer`, this.onRendererEvent);

    this.subscribe(this.rendererNotifier);
  }

  private setup() {
    this.setState(this.opts.initial());
  }

  private setState(value: any) {
    this.state = value;

    let computed = this.opts.computed();

    for (let c in computed) {
      this.state[c] = computed[c](this.state);
    }

    this.callSubscribers();
  }

  private callSubscribers() {
    for (let subscribed of this.subscribed) {
      subscribed(this.state);
    }
  }

  private rendererNotifier(state: any) {
    let renderers = this.opts.renderers();

    for (let renderer of renderers) {
      renderer.webContents.send(`store-${ this.opts.name }-main`, {
        type: 'state',
        newState: state
      })
    }
  }

  public dispatch(actionName: string, payload: any) {
    let actions = this.opts.actions();

    if (actions[actionName]) {
      let actionResult = actions[actionName](this.state, payload);
      let newState = Object.assign({}, this.state, actionResult);

      this.setState(newState);
    }
  }

  public subscribe(subscriptionFn: (state?: any) => void) {
    this.subscribed.push(subscriptionFn);
  }

  private onRendererEvent(event: IpcMainEvent, payload: RendererPayload) {
    if (payload.type == 'action') {
      this.dispatch(payload.actionName, payload.actionPayload);
    }
  }

  public getState() {
    return this.state();
  }
}

export let createStore = (opts: CreateStoreOpts) => {
  return new CargoMainStore(opts);
}
