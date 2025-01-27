import PropTypes from "prop-types";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


function Loadering({ isUploading , title , spinner: SpinnerIcon}) {
  return (
    <div>
      <Modal
        open={isUploading}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <section className="mx-auto">
          <div className="p-3">
            <SpinnerIcon className="mx-auto h-20 w-40 text-green-600 animate-spin" />
            <h4 className="text-xl text-gray-800 mx-auto p-5 text-center">
                {title}
            </h4>
          </div>
        </section>
        </Box>
      </Modal>
    </div>
  );
}

export default Loadering;

Loadering.propTypes = {
    isUploading: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    spinner: PropTypes.elementType.isRequired,
}
