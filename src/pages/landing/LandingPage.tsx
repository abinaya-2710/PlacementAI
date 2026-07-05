import HeroSection     from './HeroSection'
import FeaturesSection from './FeaturesSection'
import RoadmapsSection from './RoadmapsSection'
import CompaniesSection from './CompaniesSection'
import CTASection       from './CTASection'

/**
 * LandingPage — public home page.
 * Composed of independent section components for easy maintenance.
 */
export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <RoadmapsSection />
      <CompaniesSection />
      <CTASection />
    </>
  )
}
