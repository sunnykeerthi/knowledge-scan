const RenderTable = ({ csvArray, keys }) => {
  return (
    <table>
      <thead>
        <tr>
          {keys.map((item, idx) => (
            <th key={idx}>{item}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {csvArray.map((item, idx) => (
          <tr key={idx}>
            {keys.map((key, idx) => (
              <td>{item[key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RenderTable;
