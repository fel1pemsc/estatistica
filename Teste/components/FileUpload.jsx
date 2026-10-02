export default function FileUpload({
  onDataLoaded,
}) {

  function importarCSV(event) {

    const arquivo =
      event.target.files[0];

    if (!arquivo) return;

    const reader =
      new FileReader();

    reader.onload = (e) => {

      const texto =
        e.target.result;

      const numeros =
        texto
          .split(/[\n,;]/)
          .map(item =>
            Number(
              item.trim()
                .replace(",", ".")
            )
          )
          .filter(
            n => !isNaN(n)
          );

      onDataLoaded(
        numeros.join("\n")
      );
    };

    reader.readAsText(
      arquivo
    );
  }

  return (
    <input
      type="file"
      accept=".csv"
      onChange={
        importarCSV
      }
    />
  );
}