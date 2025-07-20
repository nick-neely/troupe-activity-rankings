export default function About() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
        About Troupe Activity Dashboard
      </h1>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">What is this?</h2>
        <p className="text-slate-600">
          Troupe Activity Dashboard is a modern web platform for group trip
          planning and activity selection. It transforms raw voting data into
          actionable insights, helping planners and decision makers understand
          group preferences, build consensus, and make data-driven choices.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">Why use it?</h2>
        <ul className="list-disc pl-6 text-slate-600 space-y-2">
          <li>See which activities have the strongest group support</li>
          <li>Identify budget sweet spots and controversial choices</li>
          <li>Visualize group dynamics and preferences at a glance</li>
          <li>Replace guesswork with concrete voting metrics</li>
        </ul>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">Methodology</h2>
        <p className="text-slate-600">
          <strong>Data Flow:</strong> An admin manually uploads your group’s
          activity data via CSV, which is first scraped from Troupe. The
          dashboard validates and imports the data, then instantly visualizes
          top activities, category performance, voting distribution, and budget
          analysis. All analytics update in real time.
          <br />
          <span className="block mt-2 text-sm text-slate-500">
            Note: This process is not yet automatically synced to Troupe—data
            must be uploaded by an admin after scraping. Automated syncing may
            be supported in the future.
          </span>
        </p>
        <ul className="list-disc pl-6 text-slate-600 space-y-2">
          <li>
            <strong>Activity Scoring:</strong> Weighted algorithm (Love: +2,
            Like: +1, Pass: -1)
          </li>
          <li>
            <strong>Category Performance:</strong> Compare different activity
            types
          </li>
          <li>
            <strong>Budget Analysis:</strong> Find best value activities per
            price range
          </li>
          <li>
            <strong>Group Dynamics:</strong> Identify consensus builders vs.
            controversial picks
          </li>
        </ul>
        <p className="text-slate-600">
          All data is securely stored and visualized using interactive charts,
          sortable tables, and advanced analytics. Admin tools allow for secure
          uploads, icon management, and more.
        </p>
      </section>
    </div>
  );
}
