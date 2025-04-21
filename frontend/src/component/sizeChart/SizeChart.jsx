import React, { useState } from "react";
import { Tab, Tabs, Table, Card, Row, Col, Image } from "react-bootstrap";
import HomeHeader from "../home/HomeHeader";
import { FaArrowRight, FaRuler, FaWeightHanging, FaTape } from "react-icons/fa";
import smallBear from "./images/small-bear.png";
import mediumBear from "./images/medium-bear.png";
import largeBear from "./images/large-bear.png";
import xlBear from "./images/xl-bear.png";

import smallRabbit from "./images/small-rabbit.png";
import mediumRabbit from "./images/medium-rabbit.png";
import largeRabbit from "./images/large-rabbit.png";
import xlRabbit from "./images/xl-rabbit.png";

import smallCartoon from "./images/small-cartoon.png";
import mediumCartoon from "./images/medium-cartoon.png";
import largCartoon from "./images/large-cartoon.png";
import xlCartoon from "./images/xl-cartoon.png";

import smallGiraf from "./images/small-girrafe.png";
import mediumGiraf from "./images/medium-girrafe.png";
import largrGiraf from "./images/large-girrafe.png";
import xlGiraf from "./images/xl-girrafe.png";

const SizeChart = () => {
  const [key, setKey] = useState("bears");

  // Using imported local images for bears
  const bearImages = {
    small: smallBear,
    medium: mediumBear,
    large: largeBear,
    xl: xlBear,
  };
  
  const rabbitImages = {
    small: smallRabbit,
    medium: mediumRabbit,
    large: largeRabbit,
    xl: xlRabbit,
  };
  
  const cartoonImages = {
    small: smallCartoon,
    medium: mediumCartoon,
    large: largCartoon,
    xl: xlCartoon,
  };
  
  const girafImages = {
    small: smallGiraf,
    medium: mediumGiraf,
    large: largrGiraf,
    xl: xlGiraf,
  };

  return (
    <>
      <HomeHeader />
      <div className="container my-5">
        <Card className="border-0 shadow-sm mb-5">
          <Card.Body className="p-4">
            <h1 className="text-center mb-4">Size Chart Guide</h1>
            <p className="lead text-center mb-5">
              Use this comprehensive guide to understand the dimensions and specifications for our soft toys
              before placing your custom order.
            </p>

            <Tabs
              id="size-chart-tabs"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-4"
              fill
            >
              <Tab eventKey="bears" title="Bears">
                <SizeDetails 
                  images={bearImages} 
                  type="Bears" 
                  description="Our teddy bears are crafted with premium materials and come in various sizes to suit your needs."
                />
              </Tab>
              <Tab eventKey="rabbits" title="Rabbits">
                <SizeDetails 
                  images={rabbitImages} 
                  type="Rabbits" 
                  description="Soft and cuddly rabbits with floppy ears that come in different sizes for all ages."
                />
              </Tab>
              <Tab eventKey="cartoon" title="Cartoon Characters">
                <SizeDetails 
                  images={cartoonImages} 
                  type="Cartoon Characters" 
                  description="Your favorite cartoon characters brought to life as huggable soft toys in multiple size options."
                />
              </Tab>
              <Tab eventKey="giraf" title="Giraffes">
                <SizeDetails 
                  images={girafImages} 
                  type="Giraffes" 
                  description="Tall and elegant giraffe soft toys with spotted patterns, available in various sizes."
                />
              </Tab>
            </Tabs>

            <div className="mt-5 pt-3 border-top">
              <h3 className="mb-3">Size Selection Guide</h3>
              <div className="d-flex flex-wrap gap-3">
                <Card className="flex-grow-1">
                  <Card.Body>
                    <Card.Title><FaRuler className="me-2 text-primary" />For Children</Card.Title>
                    <Card.Text>
                      For young children under 5 years, we recommend Small or Medium sizes for easier handling.
                    </Card.Text>
                  </Card.Body>
                </Card>
                <Card className="flex-grow-1">
                  <Card.Body>
                    <Card.Title><FaTape className="me-2 text-primary" />For Gifts</Card.Title>
                    <Card.Text>
                      Medium and Large sizes are popular choices for birthday and holiday gifts.
                    </Card.Text>
                  </Card.Body>
                </Card>
                <Card className="flex-grow-1">
                  <Card.Body>
                    <Card.Title><FaWeightHanging className="me-2 text-primary" />For Collectors</Card.Title>
                    <Card.Text>
                      Collectors often prefer Large and Extra Large sizes to showcase craftsmanship details.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card className="border-0 shadow-sm mb-5">
          <Card.Body className="p-4">
            <h2 className="mb-4">Frequently Asked Questions</h2>
            <Row>
              <Col md={6}>
                <h5>How do I measure a soft toy?</h5>
                <p>Measure from the top of the head to the bottom of the feet while the toy is standing or sitting in its natural position.</p>
                
                <h5>Are the weights exact?</h5>
                <p>Weight can vary slightly (±50g) depending on the materials and accessories used.</p>
              </Col>
              <Col md={6}>
                <h5>Can I customize the size further?</h5>
                <p>For custom sizes beyond our standard offerings, please contact our customer service team.</p>
                
                <h5>Do accessories affect the size?</h5>
                <p>Accessories like clothing or hats may add 1-2cm to the overall dimensions.</p>
              </Col>
            </Row>
            <div className="text-center mt-4">
              <a href="/customize-order" className="btn btn-primary btn-lg">
                Start Creating Your Custom Toy <FaArrowRight className="ms-2" />
              </a>
            </div>
          </Card.Body>
        </Card>
      </div>

      <footer className="bg-primary text-white text-center py-3 mt-5">
        <p>&copy; 2023 Soft Toy Production. All rights reserved.</p>
      </footer>
    </>
  );
};

// Reusable component for size details across different toy types
const SizeDetails = ({ images, type, description }) => {
  return (
    <div>
      <p className="mb-4">{description}</p>
      
      <h4 className="mb-3">Size Comparison</h4>
      <Row className="mb-4 align-items-end">
        <Col xs={12} sm={6} md={3} className="text-center mb-3">
          <div className="position-relative" style={{ height: "130px" }}>
            <Image 
              src={images.small} 
              alt="Small Size" 
              className="h-100 object-fit-contain" 
              onError={(e) => {e.target.src = "https://via.placeholder.com/130?text=Small+Size"}}
            />
          </div>
          <h5 className="mt-2">Small</h5>
        </Col>
        <Col xs={12} sm={6} md={3} className="text-center mb-3">
          <div className="position-relative" style={{ height: "160px" }}>
            <Image 
              src={images.medium} 
              alt="Medium Size" 
              className="h-100 object-fit-contain"
              onError={(e) => {e.target.src = "https://via.placeholder.com/160?text=Medium+Size"}}
            />
          </div>
          <h5 className="mt-2">Medium</h5>
        </Col>
        <Col xs={12} sm={6} md={3} className="text-center mb-3">
          <div className="position-relative" style={{ height: "190px" }}>
            <Image 
              src={images.large} 
              alt="Large Size" 
              className="h-100 object-fit-contain"
              onError={(e) => {e.target.src = "https://via.placeholder.com/190?text=Large+Size"}}
            />
          </div>
          <h5 className="mt-2">Large</h5>
        </Col>
        <Col xs={12} sm={6} md={3} className="text-center mb-3">
          <div className="position-relative" style={{ height: "220px" }}>
            <Image 
              src={images.xl} 
              alt="Extra Large Size" 
              className="h-100 object-fit-contain"
              onError={(e) => {e.target.src = "https://via.placeholder.com/220?text=Extra+Large+Size"}}
            />
          </div>
          <h5 className="mt-2">Extra Large</h5>
        </Col>
      </Row>

      <h4 className="mb-3">Detailed Specifications</h4>
      <Table striped bordered hover responsive className="mb-5">
        <thead className="table-primary">
          <tr>
            <th>Size</th>
            <th>Height (cm)</th>
            <th>Width (cm)</th>
            <th>Weight (g)</th>
            <th>Suitable For</th>
            <th>Price Factor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Small</strong></td>
            <td>20-25</td>
            <td>15-18</td>
            <td>200-300</td>
            <td>Ages 3+ / Desk companion</td>
            <td>1.0x</td>
          </tr>
          <tr>
            <td><strong>Medium</strong></td>
            <td>30-40</td>
            <td>20-25</td>
            <td>400-600</td>
            <td>Ages 3+ / Huggable size</td>
            <td>1.2x</td>
          </tr>
          <tr>
            <td><strong>Large</strong></td>
            <td>50-60</td>
            <td>30-35</td>
            <td>800-1200</td>
            <td>Ages 5+ / Room decor</td>
            <td>1.5x</td>
          </tr>
          <tr>
            <td><strong>Extra Large</strong></td>
            <td>70-90</td>
            <td>40-50</td>
            <td>1500-2500</td>
            <td>Ages 5+ / Floor display</td>
            <td>2.0x</td>
          </tr>
        </tbody>
      </Table>
      
      <h4 className="mb-3">{type} Materials & Features</h4>
      <Table bordered hover responsive className="mb-3">
        <thead className="table-primary">
          <tr>
            <th>Size</th>
            <th>Stuffing Density</th>
            <th>Detail Level</th>
            <th>Fabric Use (m²)</th>
            <th>Recommended Accessories</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Small</strong></td>
            <td>Medium</td>
            <td>Basic</td>
            <td>0.3-0.5</td>
            <td>Small bow, Mini hat</td>
          </tr>
          <tr>
            <td><strong>Medium</strong></td>
            <td>Medium-High</td>
            <td>Standard</td>
            <td>0.6-0.9</td>
            <td>Clothing, Bow, Hat</td>
          </tr>
          <tr>
            <td><strong>Large</strong></td>
            <td>High</td>
            <td>Detailed</td>
            <td>1.0-1.5</td>
            <td>Clothing, Hat, Lights</td>
          </tr>
          <tr>
            <td><strong>Extra Large</strong></td>
            <td>Very High</td>
            <td>Premium</td>
            <td>1.8-2.5</td>
            <td>Clothing, Hat, Lights, Sound</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default SizeChart;