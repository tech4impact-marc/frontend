import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import IconButton from '@mui/material/IconButton'

interface LikeButtonProps {
  liked: boolean
  onClick: () => void
}

export default function LikeButton({ liked, onClick: toggleLike }: LikeButtonProps) {
  return (
    <IconButton onClick={toggleLike}>
      {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
    </IconButton>
  )
}
