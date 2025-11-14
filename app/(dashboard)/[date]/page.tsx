import Content from "../Content";

export default async function page({
   params,
}: {
   params: Promise<{ date: string }>;
}) {
   const date = await params;

   return <Content date={date.date} />;
}
