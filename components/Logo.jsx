export default function Logo() {
  return (
    <>
      <img
        height="40px"
        width="40px"
        src="/mcap_logo_round.png"
        style={{
          display: 'inline-block',
          verticalAlign: 'middle',
        }}
      />
      <div
        style={{
          color: '#fff',
          fontSize: 26,
          fontWeight: 700,
          display: 'inline-block',
          marginLeft: '8px',
          verticalAlign: 'middle',
        }}
      >
        Mango Market Caps
      </div>
    </>
  );
}
