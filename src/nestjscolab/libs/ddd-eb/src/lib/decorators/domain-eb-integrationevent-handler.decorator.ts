import 'reflect-metadata'
import { v4 } from 'uuid'

import {
  EVENTBUS_INTEGRATION_EVENT_METADATA,
  EVENTBUS_INTEGRATION_EVENTS_HANDLER_METADATA,
} from '../constants'
import { IEbEvent } from '../interfaces'

export const EventBusIntegrationEventHandler = (
  event: IEbEvent
): ClassDecorator => {
  return (target: object) => {
    if (!Reflect.hasMetadata(EVENTBUS_INTEGRATION_EVENT_METADATA, event)) {
      Reflect.defineMetadata(
        EVENTBUS_INTEGRATION_EVENT_METADATA,
        { id: v4() },
        event
      )
    }
    Reflect.defineMetadata(
      EVENTBUS_INTEGRATION_EVENTS_HANDLER_METADATA,
      event,
      target
    )
  }
}
