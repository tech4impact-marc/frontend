import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Typography from '@mui/material/Typography'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onClickYes: () => void
  onClickNo: () => void
  title: string
  description: string
  warning: string
}

export default function ConfirmDialog({
  open,
  onClose,
  onClickYes,
  onClickNo,
  title,
  description,
  warning,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <Typography variant="h2" margin={2}>
        {title}
      </Typography>
      <DialogContentText margin="2rem">{description}</DialogContentText>
      <Alert severity="warning">{warning}</Alert>
      <DialogActions>
        <Button onClick={onClickYes} color="warning">
          예
        </Button>
        <Button onClick={onClickNo}>아니오</Button>
      </DialogActions>
    </Dialog>
  )
}
