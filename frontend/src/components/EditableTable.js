import React from "react";

export default function EditableTable({ data, setData }) {
  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  return (
    <table border="1">
      <thead>
        <tr>
          <th>Label</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr key={i}>
            <td>
              <input
                value={item.label}
                onChange={(e) => handleChange(i, "label", e.target.value)}
              />
            </td>
            <td>
              <input
                value={item.value}
                onChange={(e) => handleChange(i, "value", e.target.value)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}