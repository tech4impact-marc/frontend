import Close from '@mui/icons-material/Close'
import IosShareIcon from '@mui/icons-material/IosShare'
import PresentToAllIcon from '@mui/icons-material/PresentToAll'
import { List, ListItem } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Slide from '@mui/material/Slide'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Toolbar from '@mui/material/Toolbar'
import { TransitionProps } from '@mui/material/transitions'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import React, { useEffect } from 'react'

import Carousel from '@/components/PostCarousel'

import { FlexBox, VFlexBox } from '../styledComponents/StyledBox'
import LikeButton from './LikeButton'

interface PostDialogProps {
  postId: number
  images: string[]
  open: boolean
  onClose: () => void
}

interface Author {
  id: number
  nickname: string
}

interface Comment {
  id: number
  author: {
    id: number
    nickname: string
  }
  post_id: number
  value: string
}

interface PostResponse {
  id: number
  postId: number
  author: Author
  value: string
  comments: Comment[]
  likeCount: number
  liked: boolean
}

const ParagraphBox = styled(Box)`
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 20px;
  padding-right: 20px;
`

const PostAvatar = styled(Avatar)`
  width: 2rem;
  height: 2rem;
  margin-right: 0.5rem;
`

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />
})

const UserProfile = (userName: string) => {
  return (
    <FlexBox alignItems={'center'}>
      <PostAvatar alt="user name" />
      <Typography variant="h3">{userName}</Typography>
    </FlexBox>
  )
}

export default function PostDialog({ postId, open, onClose, images }: PostDialogProps) {
  const [author, setAuthor] = React.useState<Author | null>(null)
  const [comments, setComments] = React.useState<Comment[]>([])
  const [value, setValue] = React.useState<string>('')
  const [like_count, setLikeCount] = React.useState<number>(0)
  const [liked, setLiked] = React.useState<boolean>(false)
  const [newComment, setNewComment] = React.useState<string>('')

  const [likeEdited, setLikeEdited] = React.useState<boolean>(false)

  useEffect(() => {
    if (!open) return
    // 포스트 정보 가져오기
    const requestURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/posts/${postId}`
    axios.get(requestURL).then((res) => {
      const data: PostResponse = res.data
      console.log(data)
      setAuthor(data.author)
      setComments(data.comments)
      setLikeCount(data.likeCount)
      setLiked(data.liked)
      setValue(data.value)
    })

    return () => {
      // 언마운트시 좋아요 값이 바뀐 경우 서버에 반영
      if (!likeEdited) return
      const requestURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/posts/${postId}/likes`

      if (liked) {
        axios
          .post(requestURL)
          .then((res) => {
            console.log(res)
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        axios
          .delete(requestURL)
          .then((res) => {
            console.log(res)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  }, [open, postId])

  const handleLike = () => {
    setLiked(!liked)
    setLikeEdited(!likeEdited)
    if (liked) {
      setLikeCount(like_count - 1)
    } else {
      setLikeCount(like_count + 1)
    }
  }

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(event.target.value)
  }

  const handleUpload = () => {
    if (newComment == '') return
    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER_URL}/posts/${postId}/comments`, {
        value: newComment,
      })
      .then((res) => {
        const data: Comment = res.data
        setComments([...comments, data])
      })
      .catch((err) => {
        console.log(err)
      })

    setNewComment('')
  }

  return (
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
      <Box marginBottom={'2.5rem'}>
        <Box position={'relative'}>
          <Carousel slides={images}></Carousel>
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', top: '0.625rem', left: '0.625rem', color: '#ffffff' }}
          >
            <Close />
          </IconButton>
        </Box>
        <Box>
          <VFlexBox margin={'1.5rem 1.25rem 1rem'}>
            {UserProfile(author?.nickname ?? 'user name')}
            <Typography variant="subtitle1" marginTop={'0.5rem'}>
              2023년 12월 1일
            </Typography>
          </VFlexBox>
          <ParagraphBox>
            <Typography variant="subtitle2">{value}</Typography>
          </ParagraphBox>
          <List disablePadding>
            <ParagraphBox>
              {comments.map((comment: Comment) => {
                return (
                  <ListItem button disableGutters key={comment.id} sx={{ display: 'block' }}>
                    <FlexBox alignItems={'center'}>{UserProfile(comment.author.nickname)}</FlexBox>
                    <Box mt={'8px'} ml={'48px'}>
                      <Typography fontSize={'15px'} ml={'8px'}>
                        {comment.value}
                      </Typography>
                    </Box>
                  </ListItem>
                )
              })}
            </ParagraphBox>
          </List>
        </Box>
      </Box>

      <AppBar position="sticky" sx={{ backgroundColor: '#fff' }}>
        <FlexBox margin={'0 1rem'} alignItems={'center'} height={'3.5rem'}>
          <PostAvatar />
          <TextField
            variant="outlined"
            size="small"
            multiline
            maxRows={2}
            value={newComment}
            sx={{ flexGrow: 1 }}
          />
          <IconButton color="primary" sx={{ ml: '0.5rem' }} onClick={handleUpload}>
            <PresentToAllIcon />
          </IconButton>
        </FlexBox>
        <Toolbar sx={{ backgroundColor: '#eee', height: '3.5rem' }}>
          <IconButton>
            <IosShareIcon />
          </IconButton>
          <Box flexGrow={1} />
          <FlexBox alignItems={'center'}>
            <LikeButton liked={liked} onClick={handleLike} />
            <Typography variant="subtitle2" color={'#223047'}>
              {like_count}
            </Typography>
          </FlexBox>
        </Toolbar>
      </AppBar>
    </Dialog>
  )
}
