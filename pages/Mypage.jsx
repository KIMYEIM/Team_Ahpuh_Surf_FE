import dynamic from 'next/dynamic'
import { sampleXNY1 } from 'components/domain/AreaChartComponent/sampleXNY1'
import { sampleXNY2 } from 'components/domain/AreaChartComponent/sampleXNY2'
import { AiTwotoneSetting } from 'react-icons/ai'
import { BsFillBellFill } from 'react-icons/bs'
import Link from 'next/link'
import { Text } from 'components/base'
import ContentBox from 'components/domain/ContentBox'
import Profile from 'components/domain/Profile'
import { sampleData } from '../SampleData/Mypage'
import { heatmapSampleData } from '../SampleData/heatmapChart'
import * as Style from './myPageStyle'

const Mypage = () => {
  const AreaChartComponent = dynamic(
    import('components/domain/AreaChartComponent'),
    { ssr: false },
  )
  const dataset = []
  dataset.push({ data: sampleXNY1, name: 'react' })
  dataset.push({ data: sampleXNY2, name: 'Vue' })

  const HeatmapComponent = dynamic(
    import('components/domain/HeatmapChartComponent'),
    { ssr: false },
  )
  const handleNotice = () => {
    console.log('click notice')
  }
  return (
    <Style.Container>
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Link href="/Mypage/setting">
          <AiTwotoneSetting size={30} style={{ marginRight: 5 }} />
        </Link>
        <BsFillBellFill
          size={30}
          style={{ marginLeft: 5 }}
          onClick={() => handleNotice()}
        />
      </div>
      <Profile
        profilePhotoUrl={sampleData.profilePhotoUrl}
        userName={sampleData.userName}
        email={sampleData.email}
      />
      <Style.FollowContainer>
        <Style.FollowItem>
          <Text size={36}>{sampleData.followerCount}</Text>
          <Text size={20}>Follower</Text>
        </Style.FollowItem>
        <Style.FollowItem>
          <Text size={36}>{sampleData.followingCount}</Text>
          <Text size={20}>Following</Text>
        </Style.FollowItem>
      </Style.FollowContainer>
      <Style.Introduction>
        <Style.Title style={{ display: 'block' }}>About Me</Style.Title>
        <Style.Title>URL: </Style.Title>
        {sampleData.url ? (
          <Style.Title>{sampleData.url}</Style.Title>
        ) : (
          <Style.Title style={{ fontSize: 20, color: '#8D8D8D' }}>
            추가해보세요
          </Style.Title>
        )}
        <Style.Content>{sampleData.aboutMe}</Style.Content>
      </Style.Introduction>
      <Style.Graph>
        <Style.Title>Main ></Style.Title>
        <AreaChartComponent data={dataset} width="100%" height={300} isMyPage />
      </Style.Graph>
      <Style.Graph>
        <Style.Title>Dashboard ></Style.Title>
        <HeatmapComponent data={heatmapSampleData} width="100%" height="140%" />
      </Style.Graph>
      <ContentBox title="Images" fontSize={20} />
      <ContentBox title="files" fontSize={20} />
    </Style.Container>
  )
}
export default Mypage
