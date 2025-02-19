import { MainDropdown, BounceFinger } from 'components/base'
import { Post, SkeletonBox, Welcome } from 'components/domain'
import dynamic from 'next/dynamic'
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import * as Style from 'styles/pageStyles/indexStyle'
import {
  useGetYearScore,
  useGetPostAll,
  useGetPostsCategory,
} from 'utils/apis/post'
import { useGetCategories } from 'utils/apis/category'
import { useSWRConfig } from 'swr'
import { useRouter } from 'next/router'

const ApexChart = dynamic(
  () => import('components/domain/AreaChartComponent'),
  {
    ssr: false,
  },
)

const Main = () => {
  const router = useRouter()
  const [user, setUser] = useState({})
  const [selectedSurf, setSurf] = useState({ categoryId: null, name: 'All' })
  const [showWelcome, setShowWelcome] = useState(false)
  const { mutate } = useSWRConfig()

  if (typeof window !== 'undefined') {
    if (sessionStorage.getItem('welcome')) {
      setShowWelcome(true)
      setTimeout(() => {
        setShowWelcome(false)
      }, 2000)
      sessionStorage.removeItem('welcome')
    }
  }

  const { data: categories } = useGetCategories()
  const { data: surfData } = useGetYearScore(user.userId)
  const { data: allPosts } = useGetPostAll(user.userId, 0)
  const { data: categoryPosts } = useGetPostsCategory(
    user.userId,
    selectedSurf.categoryId,
    0,
  )

  const [dataset, setDataset] = useState([])
  const [catList, setCatList] = useState([])
  const [postList, setPostList] = useState([])

  useEffect(() => {
    if (surfData && surfData.length !== 0) {
      const allData = surfData?.map((surf) => ({
        data: surf.postScores,
        name: surf.categoryName,
      }))
      setDataset(allData)
    }
    setPostList(allPosts.values)
  }, [surfData, allPosts])

  useEffect(() => {
    if (selectedSurf.categoryId) {
      mutate(
        `/posts?userId=${user.userId}&categoryId=${selectedSurf.categoryId}&cursorId=0`,
      )
    }
  }, [selectedSurf])

  useEffect(() => {
    if (categories && categories.length !== 0) {
      setCatList([
        {
          categoryId: null,
          name: 'All',
        },
        ...categories,
      ])
    }
  }, [categories])

  useEffect(() => {
    if (Cookies.get('user')) {
      setUser(JSON.parse(Cookies.get('user')))
    }
    if (!Cookies.get('user')) {
      router.push('/login')
    }
  }, [])

  const handleClick = (item) => {
    setSurf(item)
    if (!item.categoryId) {
      const allData = surfData.map((surf) => ({
        data: surf.postScores,
        name: surf.categoryName,
      }))
      setDataset(allData)
    } else {
      const result = surfData.filter(
        (surf) => surf.categoryId === item.categoryId,
      )
      setDataset([
        {
          data: result[0]?.postScores,
          name: result[0]?.categoryName,
        },
      ])
    }
  }

  useEffect(() => {
    if (Cookies.get('isSignup')) {
      setTimeout(() => {
        toast.success('Signup was sucessful 🎉', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        })
      }, 2000)
    }
  }, [])

  return (
    <>
      {showWelcome && <Welcome />}
      <ToastContainer />
      <Style.MainWrapper>
        <Style.ChartHeader>
          <MainDropdown
            selected={selectedSurf}
            handleClick={handleClick}
            data={catList}
            isObj
            border={false}
          />
        </Style.ChartHeader>
        <Style.ChartWrapper style={{ position: 'relative' }}>
          <ApexChart data={dataset} />
          <SkeletonBox
            position="absolute"
            style={{ top: 0, left: 0, zIndex: -999 }}
            width="100%"
            height="100%"
            borderRadius={10}
            text="Loading"
            color="darkGray"
          />
        </Style.ChartWrapper>
        <Style.PostListWrapper>
          {categoryPosts?.values && categoryPosts?.values.length !== 0
            ? categoryPosts?.values.map(
                ({
                  categoryName,
                  colorCode,
                  content,
                  score,
                  selectedDate,
                  postId,
                }) => (
                  <Post
                    colorCode={colorCode}
                    height={100}
                    date={selectedDate}
                    categoryName={categoryName}
                    score={score}
                    content={content}
                    postId={postId}
                    key={postId}
                  />
                ),
              )
            : postList?.map(
                ({
                  categoryName,
                  colorCode,
                  content,
                  score,
                  selectedDate,
                  postId,
                }) => (
                  <Post
                    colorCode={colorCode}
                    height={100}
                    date={selectedDate}
                    categoryName={categoryName}
                    score={score}
                    content={content}
                    postId={postId}
                    key={postId}
                  />
                ),
              )}
          {allPosts?.values?.length === 0 && (
            <BounceFinger
              style={{
                position: 'absolute',
                bottom: '60px',
                fontSize: '20px',
                fontWeight: 700,
              }}>
              No Post! 😲 Shall we go make one?
            </BounceFinger>
          )}
        </Style.PostListWrapper>
      </Style.MainWrapper>
    </>
  )
}

export default Main
