import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
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
      <IconButton onClick={props.onClickBack} sx={{ zIndex: 1, mb: 1, color: 'primary.dark' }}>
        <ArrowBackIos />
      </IconButton>
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
