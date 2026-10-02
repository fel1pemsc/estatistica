export default function ResultCard({
  titulo,
  valor,
}) {
  return (
    <div className="resultado-card">
      <h3>{titulo}</h3>

      <span>{valor}</span>
    </div>
  );
}