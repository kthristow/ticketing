import Router from "next/router";
import useRequest from "../../hooks/use-request";
import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';

const OrderShow = ({ currentUser, order }) => {
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: (payment) => Router.push('/orders')
    })

    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 100))
        }
        findTimeLeft()
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        }
    }, [])

    if (timeLeft < 0) {
        return <div>
            Order expired!!
        </div>
    }

    return <div>
        Time left to pay: {timeLeft} seconds
        <StripeCheckout token={(token)}
            email={currentUser.email}
            amount={order.ticket.price * 100}
            stripeKey="pk_test_51PBEzpP4txQcA660BBNnSjXaMlcAiFOrKRDa7A2PzzYivyShMcbazZyqv2xahuqew7ctUzXnVeklCOH1XXSlVgew00NsuwnGia" />
            {errors}
    </div>
}


OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;

    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data };
}

export default OrderShow;