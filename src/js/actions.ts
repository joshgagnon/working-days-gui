export interface Action<T> {
  type: string
  payload: T
}

interface ActionCreator<T> {
  type: string
  (payload: T): Action<T>
}

const actionCreator = <T>(type: string): ActionCreator<T> =>
  Object.assign((payload: T):any => ({type, payload}), {type})

export const isType = <T>(action: Action<any>, actionCreator: ActionCreator<T>):
  action is Action<T> => action.type === actionCreator.type


export type Data = {
  amount: string;
  scheme: string;
  units: string;
  region?: string;
  start_date: string;
  inclusion: string;
  direction: string;
};


//Example action creator:
export interface Response {
  status: boolean
  response: Object
}


export const requestResult =
  actionCreator<Data>('REQUEST_WORKING_DAYS')
