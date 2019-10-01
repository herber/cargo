import { ipcRenderer, IpcRendererEvent } from 'electron';

interface MainPayload {
  type: string;
  newState: object;
}

interface Opts {
  storeName: string;
  rendererName: string;
}

class CargoRendererStore {
  private opts: Opts;
  private subscribed: ((state?: object) => void)[];
  private state: any;

  constructor(storeName: string, rendererName: string) {
    this.opts = {
      storeName,
      rendererName
    };
  }

  private setState(value: any) {
    this.state = value;

    this.callSubscribers();
  }

  private mainStoreSubscriber(event: IpcRendererEvent, payload: MainPayload) {
    if (payload.type == 'state') {
      this.setState(payload.newState);
    }
  }

  private callSubscribers() {
    for (let subscribed of this.subscribed) {
      subscribed(this.state);
    }
  }

  public subscribe(subscriptionFn: (state?: object) => void) {
    this.subscribed.push(subscriptionFn);
  }

  public getState() {
    return this.state();
  }

  public dispatch(actionName: string, payload: any) {
    ipcRenderer.send(`store-${ this.opts.storeName }-renderer`, {
      rendererName: this.opts.rendererName,
      type: 'action',
      actionName,
      actionPayload: payload
    });
  }
}

export let getStore = (storeName: string, rendererName: string) => {
  return new CargoRendererStore(storeName, rendererName);
};
