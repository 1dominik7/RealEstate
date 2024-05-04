import prisma from "../lib/prisma.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const payment = async (req, res) => {
  const { items } = req.body;
  const dateNow = new Date(Date.now() + 2 * (60 * 60 * 1000));

  try {
    
    const payment = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: items.title,
            },
            unit_amount: items.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/promote/successPromotion`,
      cancel_url: `${process.env.CLIENT_URL}/promote/failedPromotion`,
      payment_method_types: ["card"],
    });

    const post = await prisma.post.findUnique({
      where: {
        id: items.id,
      },
    });

    if (post.promotedTill - dateNow < 0) {
      const date = Date.now() + items.promoDays * 86400000;
      
      await prisma.post.update({
        where: { id: items.id },
        data: {
          promotedTill: {
            set: new Date(date),
          },
          stripeId: {
            push: payment.id,
          },
        },
      });
      res.status(200).json({ id: payment.id });
    } else {
      const dateTill = post.promotedTill.getTime();
      const newDate = dateTill + items.promoDays * 86400000;
      
      await prisma.post.update({
        where: { id: items.id },
        data: {
          promotedTill: {
            set: new Date(newDate),
          },
          stripeId: {
            push: payment.id,
          },
        },
      });
      res.status(200).json({ id: payment.id });
    }
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed payment!" });
  }
};
