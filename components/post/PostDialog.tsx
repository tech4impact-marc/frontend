import Close from '@mui/icons-material/Close'
import IosShareIcon from '@mui/icons-material/IosShare'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import { Container, List, ListItemButton } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import Slide from '@mui/material/Slide'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Toolbar from '@mui/material/Toolbar'
import { TransitionProps } from '@mui/material/transitions'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import React, { useEffect } from 'react'

import Carousel from '@/components/PostCarousel'
import { store } from '@/redux/store'
import type { ImageInfo } from '@/types/type'

import ConfirmDialog from '../confirmDialog'
import SNSSharingComponent from '../share/SNSSharingComponent'
import { FlexBox, VFlexBox } from '../styledComponents/StyledBox'
import LikeButton from './LikeButton'

interface PostDialogProps {
  postId: number
  imageInfoList: ImageInfo[]
  open: boolean
  userLike: boolean
  date: string
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
  like_count: number
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
  date,
}: PostDialogProps) {
  const [author, setAuthor] = React.useState<Author | null>(null)
  const [comments, setComments] = React.useState<Comment[]>([])
  const [value, setValue] = React.useState<string>('')
  const [like_count, setLikeCount] = React.useState<number>(0)
  const [newComment, setNewComment] = React.useState<string>('')
  const [isSNSShareVisible, setIsSNSShareVisible] = React.useState<boolean>(false)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [openConfirm, setOpenConfirm] = React.useState<boolean>(false)
  const [editCommentIndex, seteditCommentIndex] = React.useState<number>(-1)
  const [editComment, setEditComment] = React.useState<string>('')
  const [isEditMode, setIsEditMode] = React.useState<number>(-1)
  const state = store.getState()
  const isLoggedin = state.user == null

  useEffect(() => {
    if (!open || postId < 0) return
    // 포스트 정보 가져오기

    const requestURL = `${process.env.NEXT_PUBLIC_IP_ADDRESS}/posts/${postId}`
    axios
      .get(requestURL)
      .then((res) => {
        const data: PostResponse = res.data
        const likeCount = data.like_count
        console.log(data)
        setAuthor(data.author)
        setComments(data.comments)
        setValue(data.value)
        if (likeCount === 0 && userLike) {
          setLikeCount(likeCount + 1)
        } else {
          setLikeCount(likeCount)
        }
      })
      .catch((err) => {
        console.log(err)
        setAuthor({
          id: 0,
          nickname: '익명의 돌고래',
        })
        setLikeCount(1)
      })
  }, [open, postId])

  const handleLike = () => {
    onClickLike()
    if (userLike) {
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

  const handleCommentEditUpload = () => {
    if (editComment != '' && isEditMode >= 0 && state?.user) {
      const editedComment = comments[isEditMode]
      if (editedComment && editedComment.author.id == state.user.id) {
        const editedCommentId = editedComment.id
        axios
          .patch(
            `${process.env.NEXT_PUBLIC_IP_ADDRESS}/posts/${postId}/comments/${editedCommentId}`,
            {
              value: editComment,
            }
          )
          .then((res) => {
            const data: Comment = res.data
            const newComments = comments.map((comment) => {
              if (comment.id == editedCommentId) {
                return data
              } else {
                return comment
              }
            })
            setComments(newComments)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
    setIsEditMode(-1)
    setEditComment('')
    seteditCommentIndex(-1)
  }

  const handleShareOpen = () => {
    setIsSNSShareVisible(true)
  }

  const handleShareClose = () => {
    setIsSNSShareVisible(false)
  }

  const handleCommentEtc = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    seteditCommentIndex(index)
  }

  const handleCommentEdit = () => {
    setAnchorEl(null)
    if (isEditMode >= 0 && isEditMode == editCommentIndex) {
      // 취소
      setIsEditMode(-1)
      setEditComment('')
      seteditCommentIndex(-1)
    } else {
      // 수정
      setIsEditMode(editCommentIndex)
      setEditComment(comments[editCommentIndex].value) // ??
    }
  }

  const handleCommentDelete = () => {
    setOpenConfirm(true)
  }

  const handleConfirmClose = () => {
    setOpenConfirm(false)
  }

  const handleConfirmYes = () => {
    setOpenConfirm(false)
  }

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
                {date}
              </Typography>
            </VFlexBox>
            <ParagraphBox>
              <Typography variant="subtitle2">{value}</Typography>
            </ParagraphBox>
            <Divider />
            <List>
              {comments.map((comment: Comment, index: number) => {
                const currentUserId = state?.user ? state.user.id : null
                const commentUserId = comment.author.id
                const clickable = currentUserId ? currentUserId == commentUserId : true
                return (
                  <ListItemButton
                    disableGutters
                    disableRipple
                    key={comment.id}
                    sx={{ display: 'block', p: '0.75rem 1.25rem' }}
                  >
                    <FlexBox alignItems={'center'} justifyContent="space-between">
                      {UserProfile(comment.author.nickname, 'h5')}
                      {clickable ? (
                        <React.Fragment>
                          <IconButton onClick={(e) => handleCommentEtc(index, e)}>
                            <MoreHorizIcon />
                          </IconButton>
                          <Popover
                            elevation={0}
                            open={Boolean(anchorEl)}
                            anchorEl={anchorEl}
                            onClose={() => setAnchorEl(null)}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'left',
                            }}
                          >
                            <VFlexBox sx={{ borderRadius: 1, backgroundColor: '#eee' }}>
                              <Button onClick={handleCommentEdit}>
                                {isEditMode >= 0 && isEditMode == editCommentIndex
                                  ? '취소'
                                  : '수정'}
                              </Button>
                              <Button onClick={handleCommentDelete}>삭제</Button>
                            </VFlexBox>
                          </Popover>
                        </React.Fragment>
                      ) : null}
                    </FlexBox>
                    <Box mt={'0.5rem'} ml={'3rem'}>
                      {isEditMode >= 0 && comments[isEditMode].id == comment.id ? (
                        <FlexBox>
                          <TextField
                            variant="outlined"
                            value={editComment}
                            sx={{ flexGrow: 1 }}
                            onChange={(e) => setEditComment(e.target.value)}
                          />
                          <IconButton onClick={handleCommentEditUpload}>
                            <SendOutlinedIcon />
                          </IconButton>
                        </FlexBox>
                      ) : (
                        <Typography fontSize={'0.813rem'} ml={'0.5rem'}>
                          {comment.value}
                        </Typography>
                      )}
                    </Box>
                  </ListItemButton>
                )
              })}
            </List>
          </Box>
        </Box>
        <Container sx={{ height: '100%' }} />
        <AppBar position="sticky" sx={{ backgroundColor: '#fff' }} elevation={0}>
          <FlexBox margin={'1rem 1.25rem'} alignItems={'flex-end'}>
            <PostAvatar />
            <TextField
              multiline
              maxRows={3}
              disabled={!isLoggedin}
              variant="standard"
              value={newComment}
              label={isLoggedin ? '입력해주세요' : '로그인 해주세요'}
              sx={{ flexGrow: 1 }}
              inputProps={{
                style: {},
              }}
              onChange={handleCommentChange}
            />
            <IconButton sx={{ ml: '0.5rem' }} onClick={handleUpload}>
              <SendOutlinedIcon />
            </IconButton>
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
        imageUrl={imageInfoList[0] ?? '/test.jpeg'} //TODO: fallback url
      />
      <ConfirmDialog
        open={openConfirm}
        onClose={handleConfirmClose}
        onClickYes={handleConfirmYes}
        onClickNo={handleConfirmClose}
        title="댓글 삭제"
        description="댓글을 삭제 하시겠습니까?"
        warning="삭제 후 취소할 수 없습니다."
      />
    </React.Fragment>
  )
}
