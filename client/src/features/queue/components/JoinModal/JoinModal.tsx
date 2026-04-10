import Modal from '../../../../components/Modal';

interface JoinModalProps {
    handleJoinGroup: () => void
    closeModal: () => void
}

function JoinModal({ handleJoinGroup, closeModal }: JoinModalProps) {
    return (
      <Modal
        title="Join Group?"
        body="You will be removed from your current group."
        confirmText="Join"
        closeModal={closeModal}
        confirmAction={handleJoinGroup}
      />
    )
}

export default JoinModal;