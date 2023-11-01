import CloseIcon from '@mui/icons-material/Close'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import GetAppIcon from '@mui/icons-material/GetApp'
import ShareIcon from '@mui/icons-material/Share'
import { Box, Button, IconButton, Modal } from '@mui/material'
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
        const item = new ClipboardItem({ 'image/png': blob })

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
    const imgUrl = staticWebUrl + '/' + imageUrl // 공유화면에서 보여줄 이미지 주소(현재 X)

    window.Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: '이거 보세요!', // 제목
        description: '헤헤 찾았당', // 설명
        imageUrl: imgUrl, // 공유할 이미지 URL
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
    // 인스타그램 앱 열기 시도
    window.location.href = `instagram://`
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
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <IconButton sx={{ position: 'absolute', top: 0, right: 0 }} onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <img src={imageUrl} alt="Photo to be Shared" />
          <Button
            variant="contained"
            color="primary"
            startIcon={<GetAppIcon />}
            onClick={handleDownload}
          >
            DOWNLOAD IMAGE
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShareIcon />}
            onClick={handleKakaoShare}
          >
            KakaoTalk으로 바로 공유하기
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShareIcon />}
            onClick={handleInstagramShare}
          >
            Instagram 열기
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
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <IconButton sx={{ position: 'absolute', top: 0, right: 0 }} onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <img src={imageUrl} alt="Photo to be Shared" />
          <Button
            variant="contained"
            color="primary"
            startIcon={<GetAppIcon />}
            onClick={handleDownload}
          >
            DOWNLOAD IMAGE
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyToClipboard}
          >
            이미지를 클립보드에 복사
          </Button>
        </Box>
      </Modal>
    )
  }
}

export default SNSSharingComponent
