import { CardActionArea, CardContent, CardMedia } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useState } from 'react'

import PostDialog from './PostDialog'

interface PostCardProps {
  data: any
  index: number
}

export default function PostCard({ index, data }: PostCardProps) {
  const [showDialog, setShowDialog] = useState(false)

  const handleCardClick = () => {
    setShowDialog(true)
  }

  const handleDialogClose = () => {
    setShowDialog(false)
  }

  return (
    <>
      <Grid item xs={6} sm={6} md={6} key={data.properties?.title}>
        <Card
          elevation={3}
          sx={{
            textAlign: 'center',
            typography: 'h6',
          }}
        >
          <CardActionArea onClick={handleCardClick}>
            <CardMedia
              component="img"
              image={data.properties?.image_url ?? ''}
              alt={`post ${index} image`}
            />
            <CardContent>
              <Typography>{data.properties?.title}</Typography>
              <Box display="flex" alignItems="center">
                <Avatar alt="User name" sx={{ width: 30, height: 30 }}></Avatar>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  user name
                </Typography>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <PostDialog data={data} open={showDialog} onClose={handleDialogClose}></PostDialog>
    </>
  )
}
