export default function Home() {
  return (
    <main className="flex min-h-screen">
      <section className="flex flex-col border border-red-100 flex-1 px-14 py-32">
        <h1 className="text-3xl font-bold">Title</h1>
        <p>
          Input your text to assess its emotional intelligence. Our AI will
          analyze how readers might emotionally respond to your text.
        </p>
        <div className="col-span-full">
          <label
            htmlFor="text"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Text
          </label>
          <div className="mt-2">
            <textarea
              id="text"
              name="text"
              className="textarea textarea-bordered w-full"
            ></textarea>
          </div>
        </div>
        <button className="btn btn-primary">Check</button>
      </section>
      <section className="border border-green-300 flex-1"></section>
    </main>
  );
}
