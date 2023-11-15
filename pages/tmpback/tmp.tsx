const Form = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
        height: '100vh',
        width: '100vw',
        margin: 'auto',
        rowGap: '1rem',
        boxSizing: 'border-box',
        background: '#CCC',
        alignItems: 'center',
      }}
    >
      <div
        // key={index}
        style={{
          display: 'flex',
          width: '1080px',
          padding: '1rem',
          flexDirection: 'column',
          alignItems: 'flex-start',
          rowGap: '2rem',
          borderRadius: '8px',
          background: '#FFF',
          marginBottom: '3rem',
          // background: #FFF;
        }}
      >
        <h3>질문 1</h3>
      </div>
    </div>
  )
}
export default Form
