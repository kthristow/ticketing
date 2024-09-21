import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Ticket } from "../../../models/ticket";
import { Order, OrderStatus } from "../../../models/order";
import { ExpirationCompleteEvent } from "@khtickets11/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: 'concert',
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 20
    });
    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'sada',
        expiresAt: new Date(),
        ticket
    });

    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { listener, data, msg, ticket, order }

}


it('updates order status to cancelled', async () =>{
    const  { listener, data, msg, ticket, order } = await setup();

    await listener.onMessage(data,msg);

    const updateOrder = await Order.findById(order.id);

    expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
})

it('emit an event orderCancelled', async () =>{
    const  { listener, data, msg, ticket, order } = await setup();

    await listener.onMessage(data,msg);

   const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

   expect(eventData.id).toEqual(order.id);
})

it('ack message', async () =>{
    const  { listener, data, msg, ticket, order } = await setup();

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
})