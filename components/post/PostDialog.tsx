import Close from '@mui/icons-material/Close'
import IosShareIcon from '@mui/icons-material/IosShare'
import { Container, List, ListItemButton } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Slide from '@mui/material/Slide'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Toolbar from '@mui/material/Toolbar'
import { TransitionProps } from '@mui/material/transitions'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import { debounce } from 'lodash'
import React, { useCallback, useEffect } from 'react'

import Carousel from '@/components/PostCarousel'
import { store } from '@/redux/store'
import type { ImageInfo } from '@/types/type'

import SNSSharingComponent from '../share/SNSSharingComponent'
import { FlexBox, VFlexBox } from '../styledComponents/StyledBox'
import LikeButton from './LikeButton'

interface PostDialogProps {
  postId: number
  imageInfoList: ImageInfo[]
  open: boolean
  userLike: boolean
  onClose: () => void
  onClickLike: () => void
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
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
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

const UserProfile = (userName: string, variant: 'h3' | 'h5') => {
  return (
    <FlexBox alignItems={'center'}>
      <PostAvatar alt="user name" />
      <Typography variant={variant}>{userName}</Typography>
    </FlexBox>
  )
}

export default function PostDialog({
  postId,
  open,
  userLike,
  onClose,
  onClickLike,
  imageInfoList,
}: PostDialogProps) {
  const [author, setAuthor] = React.useState<Author | null>(null)
  const [comments, setComments] = React.useState<Comment[]>([])
  const [value, setValue] = React.useState<string>('')
  const [like_count, setLikeCount] = React.useState<number>(0)
  const [newComment, setNewComment] = React.useState<string>('')
  const [isSNSShareVisible, setIsSNSShareVisible] = React.useState<boolean>(false)
  const state = store.getState()

  useEffect(() => {
    if (!open) return
    // 포스트 정보 가져오기
    const requestURL = `${process.env.NEXT_PUBLIC_IP_ADDRESS}/posts/${postId}`
    axios.get(requestURL).then((res) => {
      const data: PostResponse = res.data
      console.log(data)
      setAuthor(data.author)
      setComments(data.comments)
      setLikeCount(data.likeCount)
      setValue(data.value)
    })
  }, [open, postId])

  const handleLike = () => {
    onClickLike()
    if (userLike) {
      setLikeCount(like_count - 1)
    } else {
      setLikeCount(like_count + 1)
    }
    debouncedLikeUpdate(!userLike, postId)
  }

  const debouncedLikeUpdate = useCallback(
    debounce(async (like: boolean, postId: number) => {
      const requestUrl = `${process.env.NEXT_PUBLIC_IP_ADDRESS}/posts/${postId}/likes`
      try {
        if (like) {
          const res = await axios.post(requestUrl)
          if (res.status !== 200) {
            throw new Error('like post error')
          }
        } else {
          const res = await axios.delete(requestUrl)
          if (res.status !== 200) {
            throw new Error('like delete error')
          }
        }
      } catch (err) {
        console.log(err)
      }
    }, 1000),
    []
  )

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(event.target.value)
  }

  const handleUpload = () => {
    if (newComment == '') return
    axios
      .post(`${process.env.NEXT_PUBLIC_IP_ADDRESS}/posts/${postId}/comments`, {
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

  const handleShareOpen = () => {
    setIsSNSShareVisible(true)
  }

  const handleShareClose = () => {
    setIsSNSShareVisible(false)
  }

  const handleClickComment = () => {}

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        disableScrollLock
      >
        <Box marginBottom={'2.5rem'}>
          <Box position={'relative'}>
            <Carousel imageInfoList={imageInfoList}></Carousel>
            <IconButton
              onClick={onClose}
              sx={{ position: 'absolute', top: '0.625rem', left: '0.625rem', color: '#ffffff' }}
            >
              <Close />
            </IconButton>
          </Box>
          <Box>
            <VFlexBox margin={'1.5rem 1.25rem 1rem'}>
              {UserProfile(author?.nickname ?? 'user name', 'h3')}
              <Typography variant="subtitle1" marginTop={'0.5rem'}>
                2023년 12월 1일
              </Typography>
            </VFlexBox>
            <ParagraphBox>
              <Typography variant="subtitle2">{value}</Typography>
            </ParagraphBox>
            <Divider />
            <List sx={{ padding: '0.75rem 0' }}>
              {comments.map((comment: Comment) => {
                const currentUserId = state.user.id
                const commentUserId = comment.author.id
                console.log(currentUserId, commentUserId)
                const clickable = currentUserId ? currentUserId == commentUserId : false

                if (!clickable) {
                  return (
                    <ListItemButton
                      disableGutters
                      disableRipple
                      key={comment.id}
                      sx={{ display: 'block', pl: '1.25rem' }}
                    >
                      <FlexBox alignItems={'center'}>
                        {UserProfile(comment.author.nickname, 'h5')}
                      </FlexBox>
                      <Box mt={'0.5rem'} ml={'3rem'}>
                        <Typography fontSize={'0.813rem'} ml={'0.5rem'}>
                          {comment.value}
                        </Typography>
                      </Box>
                    </ListItemButton>
                  )
                } else {
                  return (
                    <ListItemButton
                      disableGutters
                      key={comment.id}
                      sx={{ display: 'block', pl: '1.25rem' }}
                      onClick={handleClickComment}
                    >
                      <FlexBox alignItems={'center'}>
                        {UserProfile(comment.author.nickname, 'h5')}
                      </FlexBox>
                      <Box mt={'0.5rem'} ml={'3rem'}>
                        <Typography fontSize={'0.813rem'} ml={'0.5rem'}>
                          {comment.value}
                        </Typography>
                      </Box>
                    </ListItemButton>
                  )
                }
              })}
            </List>
          </Box>
        </Box>
        <Container sx={{ height: '100%' }} />
        <AppBar position="sticky" sx={{ backgroundColor: '#fff' }} elevation={0}>
          <FlexBox margin={'1rem 1.25rem'} alignItems={'center'}>
            <PostAvatar />
            <TextField
              variant="standard"
              value={newComment}
              placeholder="입력해주세요"
              sx={{ flexGrow: 1 }}
              inputProps={{
                style: {
                  height: '3.5rem',
                },
              }}
              onChange={handleCommentChange}
            />
            <Button
              disableElevation
              variant="contained"
              sx={{ ml: '0.5rem' }}
              onClick={handleUpload}
            >
              전송
            </Button>
          </FlexBox>
          <Toolbar sx={{ backgroundColor: '#eee', height: '3.5rem' }}>
            <IconButton onClick={handleShareOpen}>
              <IosShareIcon />
            </IconButton>
            <Box flexGrow={1} />
            <FlexBox alignItems={'center'}>
              <LikeButton liked={userLike} onClick={handleLike} />
              <Typography variant="subtitle2" color={'#223047'}>
                {like_count}
              </Typography>
            </FlexBox>
          </Toolbar>
        </AppBar>
      </Dialog>
      <SNSSharingComponent
        isOpen={isSNSShareVisible}
        onClose={handleShareClose}
        imageUrl={'/test.jpeg'}
      />
    </React.Fragment>
  )
}
