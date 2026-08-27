import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, within } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import AboutPage from './AboutPage';

const meta = {
  title: 'Features/SettingsOverview/AboutPage',
  component: AboutPage,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/settings']}>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof AboutPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state - shows the Settings Overview About page with all content
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Page header displays correctly', async () => {
      const pageTitle = canvas.getByRole('heading', {
        name: /^settings overview$/i,
        level: 1,
      });
      expect(pageTitle).toBeInTheDocument();

      const pageDescription = canvas.getByText(
        /manage all things related to eventing/i,
      );
      expect(pageDescription).toBeInTheDocument();

      const learnMore = canvas.getByText(/learn more/i);
      expect(learnMore).toBeInTheDocument();
    });

    await step('Section heading displays correctly', async () => {
      const sectionHeading = canvas.getByRole('heading', {
        name: /get started with hybrid cloud console settings/i,
        level: 2,
      });
      expect(sectionHeading).toBeInTheDocument();
    });

    await step('Alert Manager card displays correctly', async () => {
      const cardTitle = canvas.getByRole('heading', {
        name: /alert manager/i,
      });
      expect(cardTitle).toBeInTheDocument();

      const cardDescription = canvas.getByText(
        /set up, modify, and view how fired events/i,
      );
      expect(cardDescription).toBeInTheDocument();

      const button = canvas.getByRole('link', {
        name: /manage alerts/i,
      });
      expect(button).toBeInTheDocument();
      // ../alertmanager from /settings/overview
      expect(button).toHaveAttribute(
        'href',
        '/settings/platform-settings/../alertmanager',
      );
    });

    await step('Data Integrations card displays correctly', async () => {
      const cardTitle = canvas.getByRole('heading', {
        name: /data integrations/i,
      });
      expect(cardTitle).toBeInTheDocument();

      const cardDescription = canvas.getByText(
        /connect your cloud provider accounts/i,
      );
      expect(cardDescription).toBeInTheDocument();

      const button = canvas.getByRole('link', {
        name: /manage data integrations/i,
      });
      expect(button).toBeInTheDocument();
      // ../data-integrations from /settings/overview
      expect(button).toHaveAttribute(
        'href',
        '/settings/platform-settings/../data-integrations',
      );
    });

    await step('Use cases card displays correctly', async () => {
      const cardTitle = canvas.getByRole('heading', {
        name: /^use cases$/i,
      });
      expect(cardTitle).toBeInTheDocument();
    });

    await step('Recommended content card displays correctly', async () => {
      const cardTitle = canvas.getByRole('heading', {
        name: /recommended content/i,
      });
      expect(cardTitle).toBeInTheDocument();
    });
  },
};

/**
 * Use case expandable sections interaction
 */
export const ExpandableUseCases: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('First use case is expanded by default', async () => {
      const useCase1Title = canvas.getByRole('heading', {
        name: /customize your own alert notifiers/i,
      });
      expect(useCase1Title).toBeInTheDocument();

      // First use case content should be visible
      const useCase1Description = canvas.getByText(
        /determine how you, as an individual user/i,
      );
      expect(useCase1Description).toBeInTheDocument();

      const useCase1Button = canvas.getByRole('link', {
        name: /manage my notifiers/i,
      });
      expect(useCase1Button).toBeInTheDocument();
    });

    await step('Other use cases are collapsed by default', async () => {
      const useCase2Title = canvas.getByRole('heading', {
        name: /manage the default alert settings/i,
      });
      expect(useCase2Title).toBeInTheDocument();

      // Second use case content should not be visible initially
      const useCase2Description = canvas.queryByText(
        /view a log of all fired events/i,
      );
      expect(useCase2Description).not.toBeInTheDocument();

      const useCase3Title = canvas.getByRole('heading', {
        name: /view all fired events in your organization/i,
      });
      expect(useCase3Title).toBeInTheDocument();

      const useCase4Title = canvas.getByRole('heading', {
        name: /integrate data from popular cloud providers/i,
      });
      expect(useCase4Title).toBeInTheDocument();
    });

    await step('Can expand second use case', async () => {
      const useCase2Toggle = canvas.getByRole('button', {
        name: /manage the default alert settings/i,
      });
      await user.click(useCase2Toggle);

      // Second use case content should now be visible
      const useCase2Description = canvas.getByText(
        /view a log of all fired events/i,
      );
      expect(useCase2Description).toBeInTheDocument();

      const useCase2Button = canvas.getByRole('link', {
        name: /manage organization notifiers/i,
      });
      expect(useCase2Button).toBeInTheDocument();
      expect(useCase2Button).toHaveAttribute(
        'href',
        '/settings/platform-settings/../alertmanager',
      );
    });

    await step('Can collapse first use case', async () => {
      const useCase1Toggle = canvas.getByRole('button', {
        name: /customize your own alert notifiers/i,
      });
      await user.click(useCase1Toggle);

      // First use case content should no longer be visible
      const useCase1Description = canvas.queryByText(
        /determine how you, as an individual user/i,
      );
      expect(useCase1Description).not.toBeInTheDocument();
    });

    await step('Can expand third use case', async () => {
      const useCase3Toggle = canvas.getByRole('button', {
        name: /view all fired events in your organization/i,
      });
      await user.click(useCase3Toggle);

      // Third use case content should now be visible
      const useCase3Description = canvas.getByText(
        /sync up your data sources from other popular/i,
      );
      expect(useCase3Description).toBeInTheDocument();

      const useCase3Button = canvas.getByRole('link', {
        name: /view event log/i,
      });
      expect(useCase3Button).toBeInTheDocument();
      expect(useCase3Button).toHaveAttribute(
        'href',
        '/settings/platform-settings/../eventlog',
      );
    });
  },
};

/**
 * Card navigation links
 */
export const NavigationLinks: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Alert Manager button links correctly', async () => {
      const alertManagerButton = canvas.getByRole('link', {
        name: /manage alerts/i,
      });
      expect(alertManagerButton).toHaveAttribute(
        'href',
        '/settings/platform-settings/../alertmanager',
      );
    });

    await step('Data Integrations button links correctly', async () => {
      const dataIntegrationsButton = canvas.getByRole('link', {
        name: /manage data integrations/i,
      });
      expect(dataIntegrationsButton).toHaveAttribute(
        'href',
        '/settings/platform-settings/../data-integrations',
      );
    });

    await step('Use case buttons link correctly', async () => {
      // First use case (expanded by default)
      const manageNotifiersButton = canvas.getByRole('link', {
        name: /manage my notifiers/i,
      });
      expect(manageNotifiersButton).toHaveAttribute(
        'href',
        '/settings/platform-settings/../alertmanager',
      );
    });
  },
};

/**
 * Recommended content links
 */
export const RecommendedContent: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Recommended content items are present', async () => {
      const item1 = canvas.getByText(/getting started with alert manager/i);
      expect(item1).toBeInTheDocument();

      const item2 = canvas.getByText(/data integrations best practices/i);
      expect(item2).toBeInTheDocument();

      const item3 = canvas.getByText(/settings documentation/i);
      expect(item3).toBeInTheDocument();
    });

    await step('Recommended content items are links', async () => {
      // All items should be wrapped in anchor tags
      const links = canvas.getAllByRole('link');
      const recommendedLinks = links.filter((link) =>
        link.textContent?.match(
          /getting started|best practices|documentation/i,
        ),
      );
      expect(recommendedLinks.length).toBeGreaterThanOrEqual(3);
    });
  },
};

/**
 * Responsive layout - cards should stack on smaller viewports
 * This story provides a visual test for responsive behavior
 */
export const ResponsiveLayout: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('All cards are present on mobile viewport', async () => {
      expect(
        canvas.getByRole('heading', { name: /alert manager/i }),
      ).toBeInTheDocument();
      expect(
        canvas.getByRole('heading', { name: /data integrations/i }),
      ).toBeInTheDocument();
      expect(
        canvas.getByRole('heading', { name: /^use cases$/i }),
      ).toBeInTheDocument();
      expect(
        canvas.getByRole('heading', { name: /recommended content/i }),
      ).toBeInTheDocument();
    });
  },
};
