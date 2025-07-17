import { TextField, Button, Box } from '@mui/material'
import { useState } from 'react'

function BoardEditForm({ onBoardEdit, initialValues = {} }) {
   const [imgUrl, setImgUrl] = useState(import.meta.env.VITE_APP_API_URL + initialValues.img) // 이미지 경로(파일명 포함)
   const [imgFile, setImgFile] = useState(null) // 이미지 파일 객체
   const [content, setContent] = useState(initialValues.content) // 게시물 내용
   const [title, setTitle] = useState(initialValues.title) //

   // 이미지 미리보기
   const handleImageChange = (e) => {
      // e.target.files가 있으면 첫번째 파일 객체만 가져온다.
      const file = e.target.files && e.target.files[0]
      if (!file) return // 파일이 없는 경우는 함수 종료
      setImgFile(file) // 업로드한 파일 객체를 state에 저장

      // 이미지 파일 미리보기

      const reader = new FileReader()
      reader.readAsDataURL(file) // 업로드한 파일을 Base64 URL로 인코딩

      // onload(): 파일을 성공적으로 읽은 후에 실행되는 함수
      reader.onload = (event) => {
         //  console.log(event.target.result)
         setImgUrl(event.target.result) // Base64 URL을 imgUrl state에 저장
      }
   }

   // 작성한 내용 전송
   const handleSubmit = (e) => {
      e.preventDefault()

      if (!content.trim()) {
         alert('내용을 입력하세요.')
         return
      }

      if (!title.trim()) {
         alert('제목을 입력하세요.')
         return
      }

      // ★ 데이터는 formData 객체에 담겨 서버에 전송된다
      const formData = new FormData()

      formData.append('content', content)
      formData.append('title', title)

      if (imgFile) {
         // 파일명 인코딩(한글 파일명 깨짐 방지)
         const encodedFile = new File([imgFile], encodeURIComponent(imgFile.name), { type: imgFile.type })
         formData.append('img', encodedFile) // 이미지 파일 추가 post.js의 upload.single('img')와 일치해야 한다
      }
      onBoardEdit(formData) // 게시물 등록
   }

   return (
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }} encType="multipart/form-data">
         {/* 이미지 업로드 필드 */}
         <Button variant="contained" component="label">
            이미지 업로드
            <input type="file" name="img" accept="image/*" hidden onChange={handleImageChange} />
         </Button>

         {imgUrl && (
            <Box mt={2}>
               <img src={imgUrl} alt="업로드 이미지 미리보기" style={{ width: '400px' }} />
            </Box>
         )}
         {/* 제목 입력 필드 */}
         <TextField label="제목" variant="outlined" fullWidth multiline rows={2} value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mt: 2 }} />

         {/* 게시물 내용 입력 필드 */}
         <TextField label="게시물 내용" variant="outlined" fullWidth multiline rows={4} value={content} onChange={(e) => setContent(e.target.value)} sx={{ mt: 2 }} />

         <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            등록하기
         </Button>
      </Box>
   )
}

export default BoardEditForm
