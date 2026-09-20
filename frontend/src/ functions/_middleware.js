export async function onRequest(context) {
  try {
    return await context.next();
  } catch (err) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  }
}
