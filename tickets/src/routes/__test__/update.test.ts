import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../__mocks__/nats-wrapper';
import { Ticket } from '../../models/tickets';

const createTicket = () => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'asdas',
            price: 20
        })
}

it('returns 404 if id does not exists', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'asdasdasda',
            price: 20
        })
    expect(404)
})

it('returns 401 if user is not auth', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets${id}`)
        .send({
            title: 'asdasdasda',
            price: 20
        })
    expect(401)
})

it('returns 401 the user does not own a ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'asdadas',
            price: 20
        })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'sadasasdasdsadasda',
            price: 1000
        })
        .expect(401);
})

it('returns 400 if user provided bad data', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'asdadas',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20
        })
        .expect(400);
})

it('updates the tickets', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'asdadas',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 40
        })
        .expect(200);

})

it('publishes an event', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'asdadas',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 40
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

})

it('rejects updates if ticket is reserved', async () => {
   
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'asdadas',
            price: 20
        });

    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({orderId:new mongoose.Types.ObjectId().toHexString()});

    await ticket!.save();

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 40
        })
        .expect(400);
})