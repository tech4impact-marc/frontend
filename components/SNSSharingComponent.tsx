import CloseIcon from '@mui/icons-material/Close'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import GetAppIcon from '@mui/icons-material/GetApp'
import InstagramIcon from '@mui/icons-material/Instagram'
import ShareIcon from '@mui/icons-material/Share'
import { Box, Button, Divider, IconButton, Modal, Typography } from '@mui/material'
import React, { useState } from 'react'

declare global {
  interface Window {
    Kakao: any
  }
}

const loadKakaoLinkScript = () => {
  const script = document.createElement('script')
  script.src = '//developers.kakao.com/sdk/js/kakao.min.js'
  script.async = true
  document.head.appendChild(script)
}

const SNSSharingComponent = ({ isOpen, onClose, imageUrl, isMobile }: any) => {
  React.useEffect(() => {
    loadKakaoLinkScript()
  }, [])

  const [isKakaoInitialized, setKakaoInitialized] = useState(false)

  const handleDownload = () => {
    alert('다운로드된 이미지는 브라우저의 다운로드 폴더에서 확인해주세요.')
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = 'marc-downloaded-image.jpg' // 다운로드될 파일 이름 설정
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopyToClipboard = () => {
    const img = new Image()
    img.src = imageUrl

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const context = canvas.getContext('2d') as CanvasRenderingContext2D
      context.drawImage(img, 0, 0)

      canvas.toBlob((blob) => {
        const item = new ClipboardItem({ 'image/png': blob as Blob })

        navigator.clipboard
          .write([item])
          .then(() => {
            console.log('이미지가 클립보드에 복사되었습니다.')
            alert('이미지가 클립보드에 복사되었습니다.')
          })
          .catch((error) => {
            console.error('클립보드 복사 오류:', error)
          })
      }, 'image/png')
    }
  }

  const handleKakaoShare = () => {
    if (!isKakaoInitialized) {
      window.Kakao.init(process.env.NEXT_PUBLIC_JAVASCRIPT_KEY) // JS Key
      setKakaoInitialized(true)
    }
    const staticWebUrl = process.env.NEXT_PUBLIC_WEBURL // 본인 URL

    // let imgUrl
    // window.Kakao.Share.uploadImage({
    //   file: imageUrl,
    // })
    //   .then(function (response) {
    //     console.log(response.infos.original.url)
    //     imgUrl = response.infos.original.url
    //   })
    //   .catch(function (error) {
    //     console.log(error)
    //   })

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '제가 찾은 해양 생물이에요!', // 제목
        description: '저희와 함께 해양 생물을 찾아보아요!', // 설명
        // imageUrl: imgUrl, // 공유할 이미지 URL
        imageUrl: 'https://ifh.cc/g/xBq9oj.webp',
        link: {
          mobileWebUrl: staticWebUrl, // 이동시킬 페이지
          webUrl: staticWebUrl,
        },
      },
      buttons: [
        {
          title: 'MARC로 이동', // 버튼 텍스트
          link: {
            mobileWebUrl: staticWebUrl, // 버튼이 이동시킬 페이지
            webUrl: staticWebUrl,
          },
        },
      ],
    })
  }

  const handleInstagramShare = () => {
    alert('이미지를 다운로드 후, 인스타그램 앱을 켜 공유해주세요.')
  }

  if (isMobile) {
    // Mobile
    return (
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '16px',
            padding: '10px',
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', fontSize: '20px', marginTop: '16px', marginBottom: '16px' }}
          >
            공유하기
          </Typography>
          <Divider sx={{ width: '100%', margin: '0' }} />
          <IconButton
            sx={{ position: 'absolute', top: 5, right: 5 }}
            onClick={onClose}
            color="inherit"
          >
            <CloseIcon />
          </IconButton>
          <img src={imageUrl} alt="Photo to be Shared" style={{ maxWidth: '300px' }} />
          <Divider sx={{ width: '100%', margin: '0', marginBottom: '12px' }} />
          <Button
            variant="contained"
            color="secondary"
            startIcon={<GetAppIcon />}
            onClick={handleDownload}
            sx={{
              borderRadius: 0,
              width: '100%',
              height: '48px',
              justifyContent: 'flex-start',
              fontSize: '15px',
              boxShadow: 'none',
            }}
          >
            이미지 다운로드
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ShareIcon />}
            onClick={handleKakaoShare}
            sx={{
              borderRadius: 0,
              width: '100%',
              height: '48px',
              justifyContent: 'flex-start',
              fontSize: '15px',
              boxShadow: 'none',
            }}
          >
            카카오톡으로 공유
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<InstagramIcon />}
            onClick={handleInstagramShare}
            sx={{
              borderRadius: 0,
              width: '100%',
              height: '48px',
              justifyContent: 'flex-start',
              fontSize: '15px',
              boxShadow: 'none',
            }}
          >
            인스타그램에 공유
          </Button>
        </Box>
      </Modal>
    )
  } else {
    // PC
    return (
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', fontSize: '20px', marginTop: '16px', marginBottom: '16px' }}
          >
            공유하기
          </Typography>
          <Divider sx={{ width: '100%', margin: '0' }} />
          <IconButton
            sx={{ position: 'absolute', top: 5, right: 5 }}
            onClick={onClose}
            color="inherit"
          >
            <CloseIcon />
          </IconButton>
          <img src={imageUrl} alt="Photo to be Shared" />
          <Divider sx={{ width: '100%', margin: '0', marginBottom: '12px' }} />
          <Button
            variant="contained"
            color="primary"
            startIcon={<GetAppIcon />}
            onClick={handleDownload}
            sx={{
              borderRadius: 0,
              width: '100%',
              height: '48px',
              justifyContent: 'flex-start',
              fontSize: '15px',
              boxShadow: 'none',
            }}
          >
            이미지 다운로드
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyToClipboard}
            sx={{
              borderRadius: 0,
              width: '100%',
              height: '48px',
              justifyContent: 'flex-start',
              fontSize: '15px',
              boxShadow: 'none',
            }}
          >
            이미지를 클립보드에 복사
          </Button>
        </Box>
      </Modal>
    )
  }
}

export default SNSSharingComponent
