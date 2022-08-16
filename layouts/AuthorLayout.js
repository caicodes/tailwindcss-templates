import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import { PageSEO } from '@/components/SEO'
import Lottie from 'react-lottie'
// import animationData from '../data/animations/monkey-banana.json'
import animationData from '../data/animations/meditating-monkey.json'
// import animationData from '../data/animations/voya-logo-lottie.json'

export default function AuthorLayout({ children, frontMatter }) {
  const { name, avatar, occupation, company, email, twitter, linkedin, github } = frontMatter

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  return (
    <>
      <PageSEO title={`About - ${name}`} description={`About me - ${name}`} />
      <div className="divide-y divide-primary-300 dark:divide-primary-600">
        <div className="ml-8 space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-2xl font-extrabold leading-9 tracking-tight text-primary-500 dark:text-primary-200 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            About
          </h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="flex flex-col items-center pt-8 pl-8">
            <Lottie options={defaultOptions} height={300} width={300} />
            {/* <Image
              src={avatar}
              alt="avatar"
              width="192px"
              height="192px"
              className="h-48 w-48 rounded-full"
            /> */}
            <h3 className="pt-4 pb-2 text-2xl font-bold leading-8 tracking-tight text-primary-500 dark:text-primary-200">
              {name}
            </h3>
            <div className="text-scheme-500 dark:text-scheme-400">{occupation}</div>
            <div className="text-scheme-500 dark:text-scheme-400">{company}</div>
            <div className="flex space-x-3 pt-6 text-accent-400">
              <SocialIcon kind="mail" href={`mailto:${email}`} />
              <SocialIcon kind="github" href={github} />
              <SocialIcon kind="linkedin" href={linkedin} />
              <SocialIcon kind="twitter" href={twitter} />
            </div>
          </div>
          <div className="prose max-w-none pt-8 pb-8 dark:prose-dark xl:col-span-2">{children}</div>
        </div>
      </div>
    </>
  )
}
