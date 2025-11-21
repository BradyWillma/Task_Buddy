function PetPage() {
  return (
    <section>
      <h2>Pet</h2>
      <p className="section-subtitle">
        This page will show your virtual pet’s happiness, energy, and level.
      </p>
      <div className="card">
        <p>Pet sprite / stats go here.</p>
        <ul>
          <li>Happiness: (from backend later)</li>
          <li>Energy: (from backend later)</li>
          <li>Level: (from backend later)</li>
        </ul>
      </div>
    </section>
  );
}

export default PetPage;
