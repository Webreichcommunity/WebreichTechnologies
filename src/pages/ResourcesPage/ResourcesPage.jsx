import React from 'react';

const ResourcesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-400 to-yellow-500 text-white flex flex-col justify-center items-center p-5">
      <div className="max-w-4xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-white">
          🚧 Page Under Development 🚧
        </h1>
        <p className="text-lg">
          We're currently working hard to bring you a brand-new experience!
        </p>
        <p className="text-xl font-semibold">
          But don't worry, something exciting is coming soon!
        </p>

        <div className="bg-white text-black p-6 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Create Your Own Personalized AI Website</h2>
          <p className="mb-4">
            In the near future, you'll be able to create your very own webpage with an intuitive and powerful AI-driven platform. Whether you're a business owner, freelancer, or someone looking to showcase your ideas, we'll give you the tools to easily create a unique, personalized website.
          </p>
          <p className="mb-4">
            With our platform, you can:
          </p>
          <ul className="list-disc pl-5 mb-4">
            <li>Build a dynamic website tailored to your needs.</li>
            <li>Use AI to personalize content, design, and functionality.</li>
            <li>Have full control over the look and feel of your site, making it truly yours.</li>
            <li>Get access to cutting-edge features that keep you ahead of the competition.</li>
          </ul>
          <p className="font-bold">
            Stay tuned! We're making this happen soon. Thank you for your patience.
          </p>
        </div>

        <div className="mt-6">
          <p className="text-sm">
            For updates, make sure to subscribe to our newsletter and be the first to know when we launch.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
