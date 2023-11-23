import CloseIcon from '@mui/icons-material/Close'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import GetAppIcon from '@mui/icons-material/GetApp'
import ShareIcon from '@mui/icons-material/Share'
import { Box, Button, Divider, IconButton, Modal, Typography } from '@mui/material'
import NextImage from 'next/image'
import React, { useState } from 'react'
import { isMobile } from 'react-device-detect'

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

const SNSSharingComponent = ({ isOpen, onClose, imageUrl }: any) => {
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

  if (isMobile) {
    // Mobile
    return (
      <Modal
        open={isOpen}
        onClose={onClose}
        style={{ zIndex: '10000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          sx={{
            width: 300,
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 10,
            display: 'flex',
            flexDirection: 'column',
            rowGap: '1rem',
            alignItems: 'center',
            padding: '1rem',
          }}
        >
          <Typography variant="h2" sx={{ marginTop: '16px' }}>
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
          <NextImage
            src={imageUrl}
            alt="Photo to be Shared"
            width="248"
            height="248"
            style={{ borderRadius: '0.8rem', objectFit: 'contain', backgroundColor: '#CCC' }}
          />
          <Divider sx={{ width: '100%', margin: '0' }} />
          <Button
            variant="text"
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
              color: 'black',
            }}
          >
            이미지 다운로드
          </Button>
          <Button
            variant="text"
            color="primary"
            startIcon={<ShareIcon />}
            onClick={handleKakaoShare}
            sx={{
              borderRadius: 0,
              width: '100%',
              height: '48px',
              justifyContent: 'flex-start',
              fontSize: '15px',
              boxShadow: 'none',
              color: 'black',
            }}
          >
            카카오톡으로 공유
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
        style={{ zIndex: '10000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          sx={{
            width: 300,
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 10,
            display: 'flex',
            flexDirection: 'column',
            rowGap: '1rem',
            alignItems: 'center',
            padding: '1rem',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '20px', marginTop: '16px' }}>
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
          <NextImage
            src={imageUrl}
            alt="Photo to be Shared"
            width="248"
            height="248"
            style={{ borderRadius: '0.8rem', objectFit: 'contain', backgroundColor: '#CCC' }}
          />
          <Divider sx={{ width: '100%', margin: '0' }} />

          <Button
            variant="text"
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
              color: 'black',
            }}
          >
            이미지 다운로드
          </Button>
          <Button
            variant="text"
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
              color: 'black',
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
