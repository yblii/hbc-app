import Modal from '../../../../components/Modal';

interface CreateModalProps {
  handleCreateGroup: () => void
  closeModal: () => void
}

const CreateModal = ({ handleCreateGroup, closeModal }: CreateModalProps) => {
    return (
        <Modal
          title="Create Group?"
          body="You will be removed from your current group."
          confirmText="Create"
          closeModal={closeModal}
          confirmAction={handleCreateGroup}
        />
    )
}

export default CreateModal;