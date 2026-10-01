/** Renders a headline where `*word*` is the one accented word. */
export function Accent({
  text,
  color = "green",
}: {
  text: string;
  color?: "green" | "red";
}) {
  const parts = text.split(/\*(.+?)\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className={color === "red" ? "text-red" : "text-green"}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
