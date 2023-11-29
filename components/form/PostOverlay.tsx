import { Button, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { memo, useState } from 'react'

import {
  StyledContainerOne,
  StyledContainerThree,
  StyledContainerTwo,
} from '../styledComponents/StyledContainer'

const PostOverlay = ({
  postID,
  setStep,
}: {
  postID: number
  setStep: React.Dispatch<React.SetStateAction<number>>
}) => {
  const [post, setPost] = useState<string>('')
  const handlePost = () => {
    const postData = {
      value: post,
    }
    axios
      .patch(`${process.env.NEXT_PUBLIC_IP_ADDRESS}/posts/${postID}`, postData)
      .then(function (response) {
        if (response.status == 200) {
          setStep((prevStep) => prevStep + 1)
        } else {
          console.log(response)
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  return (
    <StyledContainerOne>
      <StyledContainerThree>
        <Typography variant="h2">게시글에 들어갈 말을 적어주세요</Typography>
        <Typography variant="subtitle1">자유롭게 적어주세요</Typography>
      </StyledContainerThree>
      <StyledContainerTwo>
        <Typography variant="subtitle1">게시글</Typography>
        <TextField
          placeholder="입력해주세요"
          variant="standard"
          value={post}
          onChange={(e) => setPost(e.target.value)}
          multiline
          minRows={3}
          maxRows={8}
        />
        <Typography variant="subtitle1" color={'#AAA'}>
          최대 000자까지 작성 가능해요
          <br />
          돌고래들의 정확한 위치를 특정할 수 있으면 돌고래를 괴롭게할 수 있어요
        </Typography>
      </StyledContainerTwo>

      <StyledContainerTwo sx={{ marginTop: 'auto' }}>
        <Button
          variant="contained"
          onClick={handlePost}
          disabled={post.length === 0}
          disableElevation
        >
          완료
        </Button>
      </StyledContainerTwo>
    </StyledContainerOne>
  )
}

export default memo(PostOverlay)
