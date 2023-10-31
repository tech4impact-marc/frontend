import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'

import PostCard from './PostCard'

interface PostProps {
  data: any
  onClickBack: () => void
}

const CustomBox = styled(Box)`
  flex-grow: 1;
  width: 100vw;
  height: 100vh;
  position: absolute;
  padding: 15px;
  background-color: white;
  z-index: 100;
`

export default function Post(props: PostProps) {
  console.log(props.data)

  return (
    <CustomBox>
      <Button onClick={props.onClickBack}>돌아가기</Button>
      <Grid
        container
        spacing={2}
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        {props.data.map((post: any, index: number) => (
          <PostCard data={post} index={index} key={index} />
        ))}
      </Grid>
    </CustomBox>
  )
}
