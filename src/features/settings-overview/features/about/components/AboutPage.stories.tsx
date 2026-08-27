import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import AboutPage from './AboutPage';

const meta = {
  title: 'Features/SettingsOverview/AboutPage',
  component: AboutPage,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/settings/overview']}>
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for page to render
    await waitFor(async () => {
      expect(
        await canvas.findByRole('heading', { name: /settings overview/i }),
      ).toBeInTheDocument();
    });

    // Check main sections are present
    expect(
      canvas.getByRole('heading', { name: /get started with/i }),
    ).toBeInTheDocument();

    // Check primary action buttons exist
    const links = canvas.getAllByRole('link');
    expect(
      links.some((link) => link.textContent?.includes('Manage alerts')),
    ).toBe(true);
    expect(
      links.some((link) =>
        link.textContent?.includes('Manage data integrations'),
      ),
    ).toBe(true);
  },
};

/**
 * Use case expandable sections interaction
 */
export const ExpandableUseCases: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // Wait for page to render
    await waitFor(async () => {
      expect(
        await canvas.findByRole('heading', { name: /settings overview/i }),
      ).toBeInTheDocument();
    });

    // First use case is expanded by default
    expect(
      canvas.getByText(/determine how you, as an individual user/i),
    ).toBeInTheDocument();

    // Second use case is collapsed - content not visible
    expect(
      canvas.queryByText(/configure alert notifications for your entire/i),
    ).not.toBeInTheDocument();

    // Click to expand second use case
    const useCase2Toggle = canvas.getByRole('button', {
      name: /manage the default alert settings/i,
    });
    await user.click(useCase2Toggle);

    // Second use case content now visible
    await waitFor(() => {
      const content = canvas.queryByText(
        /configure alert notifications for your entire/i,
      );
      expect(content).toBeInTheDocument();
    });

    // Click to collapse first use case
    const useCase1Toggle = canvas.getByRole('button', {
      name: /customize your own alert notifiers/i,
    });
    await user.click(useCase1Toggle);

    // First use case content no longer visible
    await waitFor(() => {
      expect(
        canvas.queryByText(/determine how you, as an individual user/i),
      ).not.toBeInTheDocument();
    });
  },
};

/**
 * Card navigation links
 */
export const NavigationLinks: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for page to render
    await waitFor(async () => {
      expect(
        await canvas.findByRole('heading', { name: /settings overview/i }),
      ).toBeInTheDocument();
    });

    // Check that navigation buttons exist with proper links
    const links = canvas.getAllByRole('link');
    const alertManagerLinks = links.filter((link) =>
      link.textContent?.includes('Manage alerts'),
    );
    expect(alertManagerLinks.length).toBeGreaterThan(0);
    expect(alertManagerLinks[0]).toHaveAttribute(
      'href',
      expect.stringContaining('alertmanager'),
    );

    const dataIntegrationsLinks = links.filter((link) =>
      link.textContent?.includes('Manage data integrations'),
    );
    expect(dataIntegrationsLinks.length).toBeGreaterThan(0);
    expect(dataIntegrationsLinks[0]).toHaveAttribute(
      'href',
      expect.stringContaining('data-integrations'),
    );
  },
};

/**
 * Recommended content links
 */
export const RecommendedContent: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for page to render
    await waitFor(async () => {
      expect(
        await canvas.findByRole('heading', { name: /settings overview/i }),
      ).toBeInTheDocument();
    });

    // Check recommended content items are present
    expect(
      canvas.getByText(/getting started with alert manager/i),
    ).toBeInTheDocument();
    expect(
      canvas.getByText(/data integrations best practices/i),
    ).toBeInTheDocument();
    expect(canvas.getByText(/settings documentation/i)).toBeInTheDocument();

    // Check external documentation link
    const docLink = canvas.getByRole('link', {
      name: /settings documentation/i,
    });
    expect(docLink).toHaveAttribute(
      'href',
      'https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console',
    );
  },
};

/**
 * Responsive layout - cards should stack on smaller viewports
 */
export const ResponsiveLayout: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for page to render
    await waitFor(async () => {
      expect(
        await canvas.findByRole('heading', { name: /settings overview/i }),
      ).toBeInTheDocument();
    });

    // All main content sections are present
    expect(
      canvas.getByRole('heading', { name: /get started with/i }),
    ).toBeInTheDocument();
    expect(canvas.getByText(/manage alerts/i)).toBeInTheDocument();
    expect(
      canvas.getAllByText(/manage data integrations/i).length,
    ).toBeGreaterThan(0);
  },
};
