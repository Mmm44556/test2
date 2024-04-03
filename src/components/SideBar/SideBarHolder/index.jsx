import { Placeholder } from 'react-bootstrap';

function SideBarHolder() {
  return (
    <>
      <div className="d-none d-sm-block text-center">
        {
          Array(7).fill(0).map((e,idx) => {
            return (
              <Placeholder.Button lg={10} sm={10} xs={10}
              key={idx}
                className="mt-3 d-inline-block"
                aria-hidden="true" />
            )
          })
        }
      </div>
    </>
  )
}

export default SideBarHolder;
